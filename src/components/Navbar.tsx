import React, { useState } from 'react';
import { 
  Calendar, 
  Building2, 
  Stethoscope, 
  MessageSquare, 
  FileSpreadsheet, 
  Presentation,
  Bot,
  LogOut,
  Settings,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AdminSettingsModal } from './AdminSettingsModal';

export type ActiveTab = 'roteiro' | 'pipeline_medicos' | 'scripts_especialidades' | 'followup_b2b' | 'prompt_sheets' | 'apresentacao';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAi }) => {
  const { user, signOut } = useAuth();
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);

  const tabs = [
    { id: 'roteiro' as ActiveTab, label: 'Roteiro de Visitas', icon: Calendar, badge: 'Hoje' },
    { id: 'pipeline_medicos' as ActiveTab, label: 'Carteira de Médicos & Clínicas', icon: Building2 },
    { id: 'scripts_especialidades' as ActiveTab, label: 'Scripts por Especialidade', icon: Stethoscope },
    { id: 'followup_b2b' as ActiveTab, label: 'Follow-Up com Clínicas', icon: MessageSquare },
    { id: 'prompt_sheets' as ActiveTab, label: 'Super Prompt B2B & Sheets', icon: FileSpreadsheet, highlight: true },
    { id: 'apresentacao' as ActiveTab, label: 'Apresentação', icon: Presentation, isSubtle: true },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Erro ao sair do Supabase:', err);
    }
    try {
      await signOut();
    } catch (err) {
      console.error('Erro no signOut do contexto:', err);
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/login');
    }
  };


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand: Logo image only */}
          <div className="flex items-center py-1">
            <img 
              src="/assets/aistudio/Gemini_Generated_Image_lo3d7nlo3d7nlo3d-removebg-preview_0086b8be.png" 
              alt="PlanePrev" 
              className="h-11 sm:h-12 md:h-13 w-auto object-contain"
            />
          </div>

          {/* Right Actions: AI Assistant, User Profile & Sign Out */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAi}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Gerador IA de Pitches</span>
            </button>

            {user && (
              <div className="flex items-center space-x-2 pl-1">
                {/* User Profile Badge */}
                <div 
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 max-w-[220px]"
                  title={`Usuário conectado: ${user.email}`}
                >
                  <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
                  </div>
                  <span className="text-xs text-slate-700 font-medium truncate">
                    {user.email}
                  </span>
                </div>

                {/* Admin-only system & Supabase settings */}
                <button
                  onClick={() => setIsAdminSettingsOpen(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
                  title="Configurações de infraestrutura e Supabase"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden lg:inline">Configurações</span>
                </button>

                {/* Botão Sair (Logout) */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer shadow-2xs"
                  title={`Desconectar (${user.email})`}
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Admin Settings Modal */}
        <AdminSettingsModal
          isOpen={isAdminSettingsOpen}
          onClose={() => setIsAdminSettingsOpen(false)}
        />

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none items-center justify-between">
          <div className="flex space-x-1 overflow-x-auto scrollbar-none">
            {tabs.slice(0, 5).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-teal-700 text-teal-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {tab.highlight && !isActive && (
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-800">
                      Prompt AI
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Discreet Presentation Tab at the end */}
          <div className="pl-2 border-l border-slate-200 shrink-0">
            {(() => {
              const tab = tabs[5];
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Abrir apresentação de slides"
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </header>
  );
};
