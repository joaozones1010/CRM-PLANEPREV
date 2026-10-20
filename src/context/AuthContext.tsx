import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    let mounted = true;

    async function checkCurrentSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (mounted) {
          if (!error && data?.session) {
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

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!email.trim() || !password) {
      return { error: new Error('Informe o e-mail e a senha.') };
    }

    try {
      // Chamada real direta ao Supabase Auth via supabase.auth.signInWithPassword sem travas estáticas
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setUser(null);
        setSession(null);

        // Exibe a mensagem de erro retornada pela API do Supabase (ex: 'E-mail ou senha incorretos')
        let msg = error.message;
        const lower = (msg || '').toLowerCase();
        if (
          lower.includes('invalid login credentials') ||
          lower.includes('invalid credentials') ||
          lower.includes('invalid_grant')
        ) {
          msg = 'E-mail ou senha incorretos.';
        } else if (lower.includes('email not confirmed')) {
          msg = 'E-mail não confirmado. Verifique o link de confirmação enviado à sua caixa de entrada.';
        } else if (lower.includes('user not found')) {
          msg = 'Usuário não encontrado no Supabase Auth.';
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
        ? 'E-mail ou senha incorretos.'
        : (err?.message || 'E-mail ou senha incorretos.');
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
