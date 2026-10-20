import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured, supabaseUrl, configureSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';

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

export function translateAuthError(error: AuthError | Error | any): string {
  if (!error) return 'Erro desconhecido de autenticação.';
  const msg = (error.message || '').toLowerCase();
  
  if (
    msg.includes('invalid login credentials') || 
    msg.includes('invalid_grant') || 
    msg.includes('invalid credentials')
  ) {
    return 'Credenciais inválidas: e-mail não encontrado ou senha incorreta no Supabase Auth.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Este e-mail já foi registrado no Supabase, mas ainda não foi confirmado. Verifique a caixa de entrada para confirmar o link antes de entrar.';
  }
  if (msg.includes('user not found')) {
    return 'Nenhum usuário cadastrado com este e-mail no Supabase Auth.';
  }
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'Este e-mail já está cadastrado no Supabase Auth. Faça login informando sua senha.';
  }
  if (msg.includes('password should be at least')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }
  if (msg.includes('invalid format') || msg.includes('valid email')) {
    return 'Formato de e-mail inválido. Digite um e-mail correto (ex: nome@clinica.com.br).';
  }
  if (msg.includes('rate limit') || msg.includes('too many requests') || msg.includes('over_email_send_rate_limit')) {
    return 'Muitas tentativas em sequência no Supabase Auth. Aguarde alguns instantes antes de tentar novamente.';
  }
  if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('fetch')) {
    return 'Não foi possível conectar ao servidor do Supabase. Verifique a URL do projeto informada e sua conexão de rede.';
  }
  return error.message || 'Falha ao autenticar no Supabase Auth.';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    async function checkCurrentSession() {
      const client = getSupabase();
      if (!client) {
        if (mounted) {
          setUser(null);
          setSession(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await client.auth.getSession();
        if (mounted) {
          if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
          } else {
            setSession(null);
            setUser(null);
          }
        }

        const { data: authListener } = client.auth.onAuthStateChange((_event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
        });

        unsubscribe = () => {
          authListener.subscription.unsubscribe();
        };
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

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [configured]);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    const client = getSupabase();
    if (!client) {
      return { 
        error: new Error('O Supabase Auth não está conectado. Configure a URL e a Chave Anônima do seu projeto Supabase para validar as credenciais.') 
      };
    }

    if (!email.trim() || !password) {
      return { error: new Error('Informe o e-mail e a senha cadastrados no Supabase Auth.') };
    }

    try {
      // REAL Supabase Authentication call via supabase.auth.signInWithPassword
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setUser(null);
        setSession(null);
        return { error: new Error(translateAuthError(error)) };
      }

      if (!data.session || !data.user) {
        setUser(null);
        setSession(null);
        return { error: new Error('Credenciais não validadas no Supabase Auth.') };
      }

      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      setUser(null);
      setSession(null);
      return { error: new Error(translateAuthError(err)) };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: Error | null; message?: string }> => {
    const client = getSupabase();
    if (!client) {
      return { 
        error: new Error('O Supabase Auth não está conectado. Configure a URL e a Chave Anônima do seu projeto Supabase.') 
      };
    }

    if (!email.trim() || password.length < 6) {
      return { error: new Error('Informe um e-mail válido e uma senha com no mínimo 6 caracteres.') };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) {
        return { error: new Error(translateAuthError(error)) };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        return { error: null, message: 'Usuário cadastrado e autenticado com sucesso no Supabase!' };
      } else {
        return { 
          error: null, 
          message: 'Cadastro criado no Supabase Auth! Se a confirmação de e-mail estiver ativa no seu projeto, confirme o e-mail recebido antes de fazer login.' 
        };
      }
    } catch (err: any) {
      return { error: new Error(translateAuthError(err)) };
    }
  };

  const signOut = async () => {
    const client = getSupabase();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.error('Erro ao sair do Supabase:', err);
      }
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
