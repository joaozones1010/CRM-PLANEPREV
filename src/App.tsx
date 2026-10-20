import React, { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { AuthProvider } from './context/AuthContext';
import { LoginView } from './components/LoginView';
import { Navbar, ActiveTab } from './components/Navbar';
import { PresentationView } from './components/PresentationView';
import { DailyRouteView } from './components/DailyRouteView';
import { DoctorPipelineView } from './components/DoctorPipelineView';
import { SpecialtyPitchesView } from './components/SpecialtyPitchesView';
import { B2BFollowUpView } from './components/B2BFollowUpView';
import { B2BPromptSheetsView } from './components/B2BPromptSheetsView';
import { AiCoPilotDrawer } from './components/AiCoPilotDrawer';
import { ShieldCheck, Building2, Loader2 } from 'lucide-react';

export default function App() {
  // 1. Estado inicial de autenticação: 'carregando' (loading = true)
  const [loading, setLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('roteiro');
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Ao carregar a página, executa supabase.auth.getSession()
    async function checkInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error || !data?.session?.user) {
          setSession(null);
          setUser(null);
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.history.replaceState(null, '', '/login');
          }
        } else {
          setSession(data.session);
          setUser(data.session.user);
          if (typeof window !== 'undefined' && window.location.pathname === '/login') {
            window.history.replaceState(null, '', '/');
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão do Supabase:', err);
        if (isMounted) {
          setSession(null);
          setUser(null);
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.history.replaceState(null, '', '/login');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkInitialSession();

    // 3. Ouvinte onAuthStateChange para atualizar o estado e redirecionar para a tela de login assim que o usuário clicar em Logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;

      const currentUser = currentSession?.user ?? null;
      setSession(currentSession);
      setUser(currentUser);
      setLoading(false);

      if (event === 'SIGNED_OUT' || !currentUser) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.history.replaceState(null, '', '/login');
        }
      } else if (event === 'SIGNED_IN' || currentUser) {
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          window.history.replaceState(null, '', '/');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 1. Enquanto estiver carregando, exibe a tela de carregamento sem mostrar o Dashboard
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <span className="text-xs font-medium">Verificando autenticação...</span>
        </div>
      </div>
    );
  }

  // 1. Se NÃO houver uma sessão ativa de usuário válida, renderiza IMEDIATAMENTE a tela de Login (/login)
  // antes de exibir qualquer elemento do Dashboard
  if (!session || !user) {
    return (
      <AuthProvider>
        <LoginView />
      </AuthProvider>
    );
  }

  // 1. Se houver uma sessão ativa válida, exibe o Dashboard normalmente
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
        {/* Top Navigation com perfil e botão Sair */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenAi={() => setIsAiOpen(true)}
        />

        {/* Main Operational Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
          {activeTab === 'apresentacao' && (
            <PresentationView onGoToCrm={() => setActiveTab('roteiro')} />
          )}

          {activeTab === 'roteiro' && (
            <DailyRouteView onGoToPipeline={() => setActiveTab('pipeline_medicos')} />
          )}

          {activeTab === 'pipeline_medicos' && (
            <DoctorPipelineView />
          )}

          {activeTab === 'scripts_especialidades' && (
            <SpecialtyPitchesView />
          )}

          {activeTab === 'followup_b2b' && (
            <B2BFollowUpView />
          )}

          {activeTab === 'prompt_sheets' && (
            <B2BPromptSheetsView />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">PlanePrev</span>
              <span>• Prospecção &amp; Parcerias com Médicos e Clínicas</span>
            </div>

            <div className="flex items-center space-x-4 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Prospecção de Clínicas B2B</span>
              </span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Conformidade Ética CFM</span>
              </span>
            </div>
          </div>
        </footer>

        {/* AI Assistant Drawer */}
        <AiCoPilotDrawer
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}
