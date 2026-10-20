import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  KeyRound, 
  Database,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { configureSupabaseCredentials, supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export const LoginView: React.FC = () => {
  const { signIn, signUp, isConfigured } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Custom Supabase Configuration modal/drawer state
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(supabaseUrl || '');
  const [customAnonKey, setCustomAnonKey] = useState(supabaseAnonKey || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error, message } = await signUp(email, password);
        if (error) {
          setErrorMessage(error.message || 'Erro ao realizar cadastro.');
        } else if (message) {
          setSuccessMessage(message);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message || 'E-mail ou senha incorretos.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customAnonKey) {
      setErrorMessage('Preencha a URL e a Anon Key do Supabase.');
      return;
    }
    configureSupabaseCredentials(customUrl, customAnonKey);
  };

  const handleQuickDemoLogin = async () => {
    setEmail('representante@planeprev.com.br');
    setPassword('PlanePrev@2026');
    setLoading(true);
    await signIn('representante@planeprev.com.br', 'PlanePrev@2026');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 selection:bg-teal-100 selection:text-teal-900">
      {/* Container */}
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center">
            <img 
              src="/assets/aistudio/Gemini_Generated_Image_lo3d7nlo3d7nlo3d-removebg-preview_0086b8be.png" 
              alt="PlanePrev" 
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Acesso restrito à plataforma de gestão comercial e prospecção
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          {/* Tabs: Entrar / Cadastrar */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                !isSignUp 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                isSignUp 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Messages */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                E-mail institucional ou de acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@planeprev.com.br"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Senha
                </label>
                <span className="text-[11px] text-slate-400">
                  Mínimo 6 dígitos
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-xs transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar e Entrar</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar na Plataforma</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Access Helper */}
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <span>Acesso Rápido de Demonstração</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Supabase Status & Config Trigger */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {isConfigured ? 'Supabase Auth Conectado' : 'Supabase Auth Pronto'}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="text-teal-700 hover:text-teal-900 underline font-medium cursor-pointer"
              >
                {isConfigured ? 'Ver Chaves' : 'Configurar Chaves'}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Supabase Config Box */}
        {showConfig && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                <Database className="w-4 h-4 text-teal-600" />
                <span>Configurar Projeto Supabase</span>
              </div>
              <button
                onClick={() => setShowConfig(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Obtenha essas credenciais no painel do seu projeto Supabase em <strong>Project Settings &gt; API</strong>:
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Project URL (VITE_SUPABASE_URL)
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Anon / Public Key (VITE_SUPABASE_ANON_KEY)
                </label>
                <input
                  type="text"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={customAnonKey}
                  onChange={(e) => setCustomAnonKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Salvar Credenciais do Supabase
              </button>
            </form>
          </div>
        )}

        {/* Security Footer */}
        <div className="text-center text-[11px] text-slate-400">
          <span>PlanePrev • Proteção de dados e conformidade com LGPD</span>
        </div>
      </div>
    </div>
  );
};
