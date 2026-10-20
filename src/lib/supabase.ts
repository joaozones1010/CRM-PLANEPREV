import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve from Vite environment variables or localStorage override
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check localStorage for manually configured keys
const localUrl = typeof window !== 'undefined' ? localStorage.getItem('planeprev_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('planeprev_supabase_anon_key') : null;

export const supabaseUrl = localUrl || envUrl || '';
export const supabaseAnonKey = localKey || envAnonKey || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function configureSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('planeprev_supabase_url', url.trim());
    localStorage.setItem('planeprev_supabase_anon_key', key.trim());
    window.location.reload();
  }
}
