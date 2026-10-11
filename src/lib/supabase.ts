import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).');
}

const globalForSupabase = globalThis as unknown as { __supabase?: SupabaseClient };

export const supabase: SupabaseClient =
  globalForSupabase.__supabase ??
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

globalForSupabase.__supabase = supabase;

export function getAuthRedirectUrl(): string {
  return (
    (import.meta.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL as string | undefined) ??
    `${window.location.origin}/auth/callback`
  );
}
