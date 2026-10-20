import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export const LoginView: React.FC = () => {
  const { signIn, updateConfig, isConfigured } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Discreet emergency setup only if user triggers logo 4 times or Alt+S
  const [logoClicks, setLogoClicks] = useState(0);
  const [showSecretSetup, setShowSecretSetup] = useState(false);
  const [secretUrl, setSecretUrl] = useState(supabaseUrl || '');
  const [secretKey, setSecretKey] = useState(supabaseAnonKey || '');

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 4) {
      setShowSecretSetup(true);
      setLogoClicks(0);
    } else {
      setLogoClicks(next);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Informe seu e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMessage(error.message || 'E-mail ou senha incorretos.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecretSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretUrl.trim() || !secretKey.trim()) return;
    updateConfig(secretUrl.trim(), secretKey.trim());
    setShowSecretSetup(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-sm w-full space-y-6">
        
        {/* Brand Logo */}
        <div className="flex justify-center items-center cursor-pointer select-none" onClick={handleLogoClick}>
          <img 
            src="/assets/aistudio/Gemini_Generated_Image_lo3d7nlo3d7nlo3d-removebg-preview_0086b8be.png" 
            alt="PlanePrev" 
            className="h-16 w-auto object-contain drop-shadow-xs"
          />
        </div>

        {/* Secret Setup Modal for Initial Setup */}
        {showSecretSetup && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-lg space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-slate-800">Conexão Supabase</span>
              <button 
                type="button"
                onClick={() => setShowSecretSetup(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Fechar
              </button>
            </div>
            <form onSubmit={handleSaveSecretSetup} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Project URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://xyz.supabase.co"
                  value={secretUrl}
                  onChange={(e) => setSecretUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Anon Key</label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1Ni..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700"
              >
                Salvar Conexão
              </button>
            </form>
          </div>
        )}

        {/* Minimal Login Card: Entrar > Email > Senha */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="space-y-1 text-center">
            <h1 className="text-lg font-bold text-slate-900">Entrar</h1>
            <p className="text-xs text-slate-500">
              Digite seu e-mail e senha para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {errorMessage && (
              <div 
                role="alert" 
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  autoComplete="email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
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
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
