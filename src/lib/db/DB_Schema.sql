-- ============================================
-- AUTHENTICATION & AUTHORIZATION SCHEMA
-- ============================================
-- This schema integrates with Supabase Auth (auth.users)
-- and manages custom roles and permissions

-- ============================================
-- 1. ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.SEC_ROLES (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert predefined roles (CRITICAL: These IDs must match constants.ts)
INSERT INTO public.SEC_ROLES (role_id, role_name) VALUES
  (1, 'STUDENT'),
  (2, 'INSTRUCTOR'),
  (4, 'ADMIN')
ON CONFLICT (role_id) DO NOTHING;

-- ============================================
-- 2. USERS TABLE (Synced with auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.SEC_USERS (
  user_id SERIAL PRIMARY KEY,
  auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sec_users_auth_user_id ON public.SEC_USERS(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_sec_users_email ON public.SEC_USERS(email);

-- ============================================
-- 3. USER ROLES (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.SEC_USER_ROLES (
  user_role_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES public.SEC_USERS(user_id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES public.SEC_ROLES(role_id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Indexes for faster role lookups
CREATE INDEX IF NOT EXISTS idx_sec_user_roles_user_id ON public.SEC_USER_ROLES(user_id);
CREATE INDEX IF NOT EXISTS idx_sec_user_roles_role_id ON public.SEC_USER_ROLES(role_id);

-- ============================================
-- 4. TRIGGER: Auto-sync auth.users → SEC_USERS
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user into SEC_USERS
  INSERT INTO public.SEC_USERS (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (auth_user_id) DO NOTHING;

  -- Assign default role (STUDENT = 1)
  INSERT INTO public.SEC_USER_ROLES (user_id, role_id)
  SELECT user_id, 1
  FROM public.SEC_USERS
  WHERE auth_user_id = NEW.id
  ON CONFLICT (user_id, role_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================
-- 5. UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sec_users_updated_at
  BEFORE UPDATE ON public.SEC_USERS
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sec_roles_updated_at
  BEFORE UPDATE ON public.SEC_ROLES
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.SEC_USERS ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.SEC_ROLES ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.SEC_USER_ROLES ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view own record"
  ON public.SEC_USERS
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own record"
  ON public.SEC_USERS
  FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Policy: Everyone can read roles
CREATE POLICY "Roles are viewable by all authenticated users"
  ON public.SEC_ROLES
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Users can view their own role assignments
CREATE POLICY "Users can view own roles"
  ON public.SEC_USER_ROLES
  FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM public.SEC_USERS WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(user_email TEXT)
RETURNS TABLE(role_id INT, role_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.role_id, r.role_name
  FROM public.SEC_USER_ROLES ur
  JOIN public.SEC_USERS u ON ur.user_id = u.user_id
  JOIN public.SEC_ROLES r ON ur.role_id = r.role_id
  WHERE u.email = user_email
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(user_email TEXT, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.SEC_USER_ROLES ur
    JOIN public.SEC_USERS u ON ur.user_id = u.user_id
    JOIN public.SEC_ROLES r ON ur.role_id = r.role_id
    WHERE u.email = user_email AND r.role_name = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
