import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve from Vite environment variables or localStorage
function getInitialUrl(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('planeprev_supabase_url');
    if (local && local.trim().startsWith('https://')) return local.trim();
  }
  const env = import.meta.env.VITE_SUPABASE_URL;
  if (env && typeof env === 'string' && env.startsWith('https://') && !env.includes('your-project-id')) {
    return env.trim();
  }
  return '';
}

function getInitialKey(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('planeprev_supabase_anon_key');
    if (local && local.trim().length > 10) return local.trim();
  }
  const env = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (env && typeof env === 'string' && env.length > 10 && !env.includes('your-anon-public-key')) {
    return env.trim();
  }
  return '';
}

export let supabaseUrl: string = getInitialUrl();
export let supabaseAnonKey: string = getInitialKey();

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey.length > 15
  );
}

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
}

export function configureSupabaseCredentials(url: string, key: string): { success: boolean; error?: string } {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl.startsWith('https://')) {
      return { success: false, error: 'A URL do Supabase deve iniciar com https://' };
    }
    if (cleanKey.length < 20) {
      return { success: false, error: 'A chave anônima (anon public key) informada é inválida ou curta demais.' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('planeprev_supabase_url', cleanUrl);
      localStorage.setItem('planeprev_supabase_anon_key', cleanKey);
    }

    supabaseUrl = cleanUrl;
    supabaseAnonKey = cleanKey;
    clientInstance = createClient(cleanUrl, cleanKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha ao inicializar o cliente Supabase.' };
  }
}

export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('planeprev_supabase_url');
    localStorage.removeItem('planeprev_supabase_anon_key');
  }
  supabaseUrl = '';
  supabaseAnonKey = '';
  clientInstance = null;
}
