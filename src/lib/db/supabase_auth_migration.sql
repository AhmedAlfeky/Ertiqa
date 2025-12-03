-- =============================================================================
-- SUPABASE AUTH INTEGRATION WITH CUSTOM SCHEMA
-- =============================================================================
-- This migration syncs Supabase's auth.users with your custom SEC_USERS table
-- and handles role-based user creation

-- =============================================================================
-- 1. FUNCTION: Sync auth.users to SEC_USERS
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role_id INTEGER;
  v_full_name TEXT;
BEGIN
  -- Extract metadata from auth.users
  v_full_name := NEW.raw_user_meta_data->>'full_name';
  
  -- Insert into SEC_USERS (without password_hash - Supabase handles auth)
  INSERT INTO public.SEC_USERS (
    EMAIL,
    PASSWORD_HASH,  -- Empty since Supabase manages passwords
    IS_ACTIVE,
    EMAIL_VERIFIED,
    CREATED_AT
  ) VALUES (
    NEW.email,
    '',  -- Supabase handles password hashing in auth.users
    TRUE,
    NEW.email_confirmed_at IS NOT NULL,
    NOW()
  )
  ON CONFLICT (EMAIL) DO NOTHING;

  -- Get the role from metadata (default to STUDENT if not specified)
  v_role_id := COALESCE(
    (NEW.raw_user_meta_data->>'role_id')::INTEGER,
    (SELECT ID FROM public.SEC_ROLES WHERE NAME = 'STUDENT' LIMIT 1)
  );

  -- Assign role to user
  INSERT INTO public.SEC_USER_ROLES (USER_ID, ROLE_ID, ASSIGNED_AT)
  SELECT 
    (SELECT ID FROM public.SEC_USERS WHERE EMAIL = NEW.email),
    v_role_id,
    NOW()
  ON CONFLICT (USER_ID, ROLE_ID) DO NOTHING;

  -- Create profile
  INSERT INTO public.INF_PROFILES (
    USER_ID,
    FULL_NAME,
    CREATED_AT
  )
  SELECT 
    (SELECT ID FROM public.SEC_USERS WHERE EMAIL = NEW.email),
    COALESCE(v_full_name, ''),
    NOW()
  ON CONFLICT (USER_ID) DO NOTHING;

  -- If role is INSTRUCTOR, create instructor record
  IF v_role_id = (SELECT ID FROM public.SEC_ROLES WHERE NAME = 'INSTRUCTOR' LIMIT 1) THEN
    INSERT INTO public.INF_INSTRUCTORS (
      USER_ID,
      VERIFIED,
      JOINED_AT
    )
    SELECT 
      (SELECT ID FROM public.SEC_USERS WHERE EMAIL = NEW.email),
      FALSE,
      NOW()
    ON CONFLICT (USER_ID) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 2. TRIGGER: Execute on new user creation
-- =============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 3. FUNCTION: Get user role by email
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_user_role(user_email TEXT)
RETURNS TABLE (
  role_id INTEGER,
  role_name VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.ID as role_id,
    r.NAME as role_name
  FROM public.SEC_USERS u
  JOIN public.SEC_USER_ROLES ur ON u.ID = ur.USER_ID
  JOIN public.SEC_ROLES r ON ur.ROLE_ID = r.ID
  WHERE u.EMAIL = user_email
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. FUNCTION: Check if user has specific role
-- =============================================================================
CREATE OR REPLACE FUNCTION public.user_has_role(
  user_email TEXT,
  role_name_param VARCHAR(50)
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.SEC_USERS u
    JOIN public.SEC_USER_ROLES ur ON u.ID = ur.USER_ID
    JOIN public.SEC_ROLES r ON ur.ROLE_ID = r.ID
    WHERE u.EMAIL = user_email
    AND r.NAME = role_name_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on tables
ALTER TABLE public.SEC_USERS ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.SEC_USER_ROLES ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.INF_PROFILES ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.INF_INSTRUCTORS ENABLE ROW LEVEL SECURITY;

-- SEC_USERS: Users can read their own data
CREATE POLICY "Users can view own data"
  ON public.SEC_USERS
  FOR SELECT
  USING (EMAIL = auth.jwt()->>'email');

-- SEC_USER_ROLES: Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.SEC_USER_ROLES
  FOR SELECT
  USING (
    USER_ID = (
      SELECT ID FROM public.SEC_USERS 
      WHERE EMAIL = auth.jwt()->>'email'
    )
  );

-- INF_PROFILES: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.INF_PROFILES
  FOR SELECT
  USING (
    USER_ID = (
      SELECT ID FROM public.SEC_USERS 
      WHERE EMAIL = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.INF_PROFILES
  FOR UPDATE
  USING (
    USER_ID = (
      SELECT ID FROM public.SEC_USERS 
      WHERE EMAIL = auth.jwt()->>'email'
    )
  );

-- INF_INSTRUCTORS: Instructors can view their own data
CREATE POLICY "Instructors can view own data"
  ON public.INF_INSTRUCTORS
  FOR SELECT
  USING (
    USER_ID = (
      SELECT ID FROM public.SEC_USERS 
      WHERE EMAIL = auth.jwt()->>'email'
    )
  );

-- =============================================================================
-- 6. INDEXES for Performance
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_sec_users_email ON public.SEC_USERS(EMAIL);
CREATE INDEX IF NOT EXISTS idx_sec_user_roles_user_id ON public.SEC_USER_ROLES(USER_ID);
CREATE INDEX IF NOT EXISTS idx_sec_user_roles_role_id ON public.SEC_USER_ROLES(ROLE_ID);
CREATE INDEX IF NOT EXISTS idx_inf_profiles_user_id ON public.INF_PROFILES(USER_ID);
CREATE INDEX IF NOT EXISTS idx_inf_instructors_user_id ON public.INF_INSTRUCTORS(USER_ID);

-- =============================================================================
-- NOTES:
-- =============================================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Supabase Auth handles password hashing, email verification, OAuth
-- 3. SEC_USERS.PASSWORD_HASH can be removed or left empty
-- 4. Role metadata is passed during signup: { role_id: 1 or 2 }
-- 5. STUDENT role_id = 1, INSTRUCTOR role_id = 2 (from your schema)
