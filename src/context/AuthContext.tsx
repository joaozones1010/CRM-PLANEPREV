import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | { email: string; id: string } | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

const LOCAL_SESSION_KEY = 'planeprev_auth_local_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; id: string } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (mounted) {
            if (!error && data.session) {
              setSession(data.session);
              setUser(data.session.user);
            }
          }

          const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (mounted) {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
            }
          });

          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (err) {
          console.error('Erro ao inicializar Supabase Auth:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        // Fallback local session if Supabase credentials are not in environment yet
        try {
          const stored = localStorage.getItem(LOCAL_SESSION_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
          }
        } catch (e) {
          console.error('Erro ao ler sessão local:', e);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      return { error: null };
    } else {
      // Local demo mode authentication
      if (!email.includes('@') || password.length < 6) {
        return { error: new Error('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.') };
      }

      const mockUser = {
        id: 'usr_' + Date.now(),
        email: email.trim(),
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
      return { error: null };
    }
  };

  const signUp = async (email: string, password: string): Promise<{ error: Error | null; message?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        return { error: null };
      } else {
        return { 
          error: null, 
          message: 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta antes de entrar.' 
        };
      }
    } else {
      if (!email.includes('@') || password.length < 6) {
        return { error: new Error('Informe um e-mail válido e uma senha com pelo menos 6 caracteres.') };
      }

      const mockUser = {
        id: 'usr_' + Date.now(),
        email: email.trim(),
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
      return { error: null, message: 'Conta criada e autenticada com sucesso!' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
