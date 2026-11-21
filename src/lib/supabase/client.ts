import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for browser-side authentication and real-time events.
 * Connects using public anon credentials.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const createBrowserSupabaseClient = createClient;


