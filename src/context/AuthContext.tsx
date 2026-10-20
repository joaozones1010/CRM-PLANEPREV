import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, supabaseUrl, configureSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  supabaseUrl: string;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; message?: string }>;
  signOut: () => Promise<void>;
  updateConfig: (url: string, key: string) => { success: boolean; error?: string };
  resetConfig: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  supabaseUrl: '',
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateConfig: () => ({ success: false }),
  resetConfig: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado inicial de autenticação: carregando (loading = true)
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [configured, setConfigured] = useState<boolean>(isSupabaseConfigured());

  useEffect(() => {
    let mounted = true;

    // 1. Ao carregar a página, executa supabase.auth.getSession()
    async function checkCurrentSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (mounted) {
          if (!error && data?.session?.user) {
            setSession(data.session);
            setUser(data.session.user);
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão do Supabase:', err);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkCurrentSession();

    // 3. Ouvinte onAuthStateChange para sincronizar estado global
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 2. Chamada real ao Supabase Auth via signInWithPassword
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!email.trim() || !password) {
      return { error: new Error('Informe o e-mail e a senha.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setUser(null);
        setSession(null);

        // Mensagens de erro claras para o usuário
        let msg = error.message;
        const lower = (msg || '').toLowerCase();
        if (
          lower.includes('invalid login credentials') ||
          lower.includes('invalid credentials') ||
          lower.includes('invalid_grant') ||
          lower.includes('invalid password') ||
          lower.includes('user not found')
        ) {
          msg = 'E-mail ou senha inválidos.';
        } else if (lower.includes('email not confirmed')) {
          msg = 'E-mail não confirmado. Verifique o link de confirmação enviado à sua caixa de entrada.';
        }

        return { error: new Error(msg) };
      }

      if (data?.user && data?.session) {
        setSession(data.session);
        setUser(data.user);
        return { error: null };
      }

      return { error: null };
    } catch (err: any) {
      setUser(null);
      setSession(null);
      const msg = err?.message?.toLowerCase().includes('invalid login credentials')
        ? 'E-mail ou senha inválidos.'
        : (err?.message || 'E-mail ou senha inválidos.');
      return { error: new Error(msg) };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: Error | null; message?: string }> => {
    if (!email.trim() || password.length < 6) {
      return { error: new Error('Informe um e-mail válido e uma senha com no mínimo 6 caracteres.') };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        return { error: null, message: 'Usuário cadastrado e autenticado com sucesso no Supabase!' };
      } else {
        return { 
          error: null, 
          message: 'Cadastro criado no Supabase Auth! Se a confirmação de e-mail estiver ativa, confirme o e-mail recebido antes de fazer login.' 
        };
      }
    } catch (err: any) {
      return { error: new Error(err?.message || 'Falha ao cadastrar usuário.') };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Erro ao sair do Supabase:', err);
    }
    setUser(null);
    setSession(null);
  };

  const updateConfig = (url: string, key: string) => {
    const res = configureSupabaseCredentials(url, key);
    if (res.success) {
      setConfigured(isSupabaseConfigured());
      setUser(null);
      setSession(null);
    }
    return res;
  };

  const resetConfig = () => {
    clearSupabaseCredentials();
    setConfigured(false);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configured,
        supabaseUrl,
        signIn,
        signUp,
        signOut,
        updateConfig,
        resetConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
