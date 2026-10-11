import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

// Environment variables or fallback defaults for the preview environment
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mock-zaboraa.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-preview-key';

let client: SupabaseClient | null = null;
try {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
} catch (e) {
  console.warn('Failed to initialize Supabase client:', e);
}

export const supabase = client;

export interface SupabaseUserProfile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url?: string | null;
}
