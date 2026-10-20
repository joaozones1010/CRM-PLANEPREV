import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Leitura direta das variáveis de ambiente no runtime do Vite
const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '';
const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '';

// Suporte adicional a localStorage caso as credenciais tenham sido configuradas no painel
function getResolvedUrl(): string {
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('planeprev_supabase_url');
    if (local && local.trim().length > 0) return local.trim();
  }
  // URL segura para inicialização sem quebrar o módulo
  return 'https://default-project.supabase.co';
}

function getResolvedKey(): string {
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('planeprev_supabase_anon_key');
    if (local && local.trim().length > 0) return local.trim();
  }
  return 'default-anon-key-placeholder';
}

export let supabaseUrl: string = getResolvedUrl();
export let supabaseAnonKey: string = getResolvedKey();

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://default-project.supabase.co' &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'default-anon-key-placeholder'
  );
}

// Inicialização do cliente Supabase usando import.meta.env.VITE_SUPABASE_URL e import.meta.env.VITE_SUPABASE_ANON_KEY
export let supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function getSupabase(): SupabaseClient {
  return supabase;
}

export function configureSupabaseCredentials(url: string, key: string): { success: boolean; error?: string } {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl.startsWith('https://')) {
      return { success: false, error: 'A URL do Supabase deve iniciar com https://' };
    }
    if (cleanKey.length < 10) {
      return { success: false, error: 'A chave anônima informada é curta demais ou inválida.' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('planeprev_supabase_url', cleanUrl);
      localStorage.setItem('planeprev_supabase_anon_key', cleanKey);
    }

    supabaseUrl = cleanUrl;
    supabaseAnonKey = cleanKey;
    supabase = createClient(cleanUrl, cleanKey, {
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
  supabaseUrl = getResolvedUrl();
  supabaseAnonKey = getResolvedKey();
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
