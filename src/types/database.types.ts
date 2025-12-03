// Placeholder for generated database types
// Generate these using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
export type Database = {
  public: {
    Tables: {
      SEC_USERS: {
        Row: {
          user_id: number;
          auth_user_id: string;
          email: string;
          full_name: string | null;
          profile_picture_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: number;
          auth_user_id: string;
          email: string;
          full_name?: string | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: number;
          auth_user_id?: string;
          email?: string;
          full_name?: string | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      SEC_ROLES: {
        Row: {
          role_id: number;
          role_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          role_id?: number;
          role_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role_id?: number;
          role_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      SEC_USER_ROLES: {
        Row: {
          user_role_id: number;
          user_id: number;
          role_id: number;
          assigned_at: string;
        };
        Insert: {
          user_role_id?: number;
          user_id: number;
          role_id: number;
          assigned_at?: string;
        };
        Update: {
          user_role_id?: number;
          user_id?: number;
          role_id?: number;
          assigned_at?: string;
        };
      };
    };
  };
};
