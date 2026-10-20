import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Server, 
  UserPlus, 
  Loader2,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose }) => {
  const { isConfigured, updateConfig, signUp } = useAuth();

  const [activeTab, setActiveTab] = useState<'config' | 'new_user'>('config');
  
  // Supabase Credentials
  const [customUrl, setCustomUrl] = useState(supabaseUrl || '');
  const [customAnonKey, setCustomAnonKey] = useState(supabaseAnonKey || '');
  const [showAnonKey, setShowAnonKey] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New User Creation
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!customUrl.trim() || !customAnonKey.trim()) {
      setFeedback({ type: 'error', message: 'Preencha a Project URL e a Anon Public Key.' });
      return;
    }

    const res = updateConfig(customUrl.trim(), customAnonKey.trim());
    if (res.success) {
      setFeedback({ type: 'success', message: 'Configurações do Supabase salvas e ativas com sucesso!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Erro ao salvar credenciais.' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFeedback(null);

    if (!newUserEmail.trim() || newUserPassword.length < 6) {
      setUserFeedback({ type: 'error', message: 'Informe um e-mail válido e uma senha com pelo menos 6 dígitos.' });
      return;
    }

    setCreateUserLoading(true);
    try {
      const { error, message } = await signUp(newUserEmail, newUserPassword);
      if (error) {
        setUserFeedback({ type: 'error', message: error.message });
      } else {
        setUserFeedback({ 
          type: 'success', 
          message: message || 'Novo usuário cadastrado com sucesso no Supabase Auth!' 
        });
        setNewUserEmail('');
        setNewUserPassword('');
      }
    } catch (err: any) {
      setUserFeedback({ type: 'error', message: err?.message || 'Falha ao cadastrar usuário.' });
    } finally {
      setCreateUserLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Painel de Administração do Sistema</h2>
              <p className="text-[11px] text-slate-500">Configurações de infraestrutura e gestão de acessos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'config'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Conexão Supabase
          </button>
          <button
            onClick={() => setActiveTab('new_user')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'new_user'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cadastrar Novo Usuário
          </button>
          <button
            onClick={() => setActiveTab('sql' as any)}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              (activeTab as any) === 'sql'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tabela no Supabase (SQL)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {activeTab === 'config' && (
            <div className="space-y-4 text-xs">
              {/* Status Badge */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isConfigured 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center space-x-2">
                  {isConfigured ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Server className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="font-medium">
                    {isConfigured ? 'Supabase Auth Conectado e Ativo' : 'Supabase Auth Não Configurado'}
                  </span>
                </div>
              </div>

              {feedback && (
                <div className={`p-3 rounded-xl border flex items-center space-x-2 ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveCredentials} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://xyzcompany.supabase.co"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Supabase Anon / Public Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAnonKey(!showAnonKey)}
                      className="text-[11px] text-teal-600 hover:text-teal-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {showAnonKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showAnonKey ? 'Ocultar' : 'Exibir'}</span>
                    </button>
                  </div>
                  <input
                    type={showAnonKey ? 'text' : 'password'}
                    required
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={customAnonKey}
                    onChange={(e) => setCustomAnonKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                >
                  Salvar e Atualizar Conexão
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                <p>
                  As credenciais são salvas de forma segura para validar todos os logins na base de dados do Supabase. Para gerenciar usuários e tabelas diretamente, acesse o painel oficial em <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-teal-600 underline font-medium inline-flex items-center space-x-0.5"><span>supabase.com/dashboard</span><ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'new_user' && (
            <div className="space-y-4 text-xs">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Cadastre um novo usuário institucional para liberar acesso à dashboard com e-mail e senha.
              </p>

              {userFeedback && (
                <div className={`p-3 rounded-xl border flex items-center space-x-2 ${
                  userFeedback.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {userFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{userFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    E-mail do novo usuário
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="novo.usuario@planeprev.com.br"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Senha de acesso inicial (mínimo 6 dígitos)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createUserLoading}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {createUserLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cadastrando no Supabase...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Criar Usuário no Supabase</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {(activeTab as any) === 'sql' && (
            <div className="space-y-3 text-xs">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Execute o script abaixo no <strong>SQL Editor</strong> do seu painel Supabase para criar a tabela oficial <code>medicos_clinicas</code> com permissões públicas de leitura e escrita:
              </p>

              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1 select-all">
                <pre>{`-- Criação da tabela de Médicos e Clínicas PlanePrev
CREATE TABLE IF NOT EXISTS public.medicos_clinicas (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  crm TEXT,
  especialidade TEXT,
  clinica TEXT NOT NULL,
  endereco TEXT,
  cidade_bairro TEXT,
  secretaria TEXT,
  telefone_secretaria TEXT,
  telefone_medico TEXT,
  melhor_horario TEXT,
  status_parceria TEXT,
  data_ultima_visita TEXT,
  proxima_visita TEXT,
  material_entregue TEXT,
  termo_assinado BOOLEAN DEFAULT FALSE,
  potencial_volume TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ativação de RLS e políticas de acesso
ALTER TABLE public.medicos_clinicas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso completo aos médicos autenticados"
  ON public.medicos_clinicas
  FOR ALL
  USING (true)
  WITH CHECK (true);`}</pre>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Cole este script no <strong>Supabase Dashboard &gt; SQL Editor &gt; Run</strong>.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
