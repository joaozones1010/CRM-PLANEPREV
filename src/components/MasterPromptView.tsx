import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Sliders, 
  BookOpen, 
  Bot, 
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  CalendarClock
} from 'lucide-react';
import { buildMasterPrompt, defaultPromptParams, PromptParameters } from '../data/masterPrompt';

interface MasterPromptViewProps {
  onRunInAi: (promptText: string) => void;
}

export const MasterPromptView: React.FC<MasterPromptViewProps> = ({ onRunInAi }) => {
  const [params, setParams] = useState<PromptParameters>(defaultPromptParams);
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const generatedPrompt = useMemo(() => {
    return buildMasterPrompt(params);
  }, [params]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PlanePrev_SuperPrompt_GoogleAIStudio.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 md:p-8 border border-teal-500/30 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engenharia de Prompt para Google AI Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Super Prompt de Gestão Comercial & CRM PlanePrev
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-300 leading-relaxed">
            Prompt mestre arquitetado por especialista em automação e CRM na área médica. Solicita um sistema operacional completo para o representante externo: Google Sheets de 5 abas, matriz clínica de CIDs, quebra de objeções éticas (CFM), régua de follow-up automatizada e qualificação por urgência de diagnóstico.
          </p>

          {/* Quick Metrics & Pillars */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 backdrop-blur rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center space-x-2 text-teal-400 mb-1">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="text-xs font-bold">Google Sheets</span>
              </div>
              <p className="text-xs text-slate-300">5 Abas + Apps Script</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                <Stethoscope className="w-4 h-4" />
                <span className="text-xs font-bold">Especialidades</span>
              </div>
              <p className="text-xs text-slate-300">Onco, Nefro, Orto, Cardio</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center space-x-2 text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold">Playbook CFM</span>
              </div>
              <p className="text-xs text-slate-300">Secretárias & Médicos</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center space-x-2 text-amber-400 mb-1">
                <CalendarClock className="w-4 h-4" />
                <span className="text-xs font-bold">Follow-Up D</span>
              </div>
              <p className="text-xs text-slate-300">D+0 até D+30 Nutrição</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-teal-500 hover:bg-teal-400 text-slate-950 transition shadow-lg shadow-teal-500/20 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{copied ? 'Prompt Copiado com Sucesso!' : 'Copiar Prompt para Google AI Studio'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Markdown (.md)</span>
            </button>

            <button
              onClick={() => onRunInAi(generatedPrompt)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm bg-slate-800/80 hover:bg-teal-900/40 text-teal-300 border border-teal-500/40 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Executar com Assistente IA</span>
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl font-medium text-xs md:text-sm bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer ml-auto"
            >
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>{showConfig ? 'Fechar Personalizador' : 'Personalizar Variáveis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Param Customizer Box */}
      {showConfig && (
        <div className="rounded-2xl bg-slate-900 p-6 border border-teal-500/40 shadow-lg transition-all animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center space-x-2 text-teal-300">
              <Sliders className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Parâmetros do Prompt para Google AI Studio</h3>
            </div>
            <span className="text-xs text-slate-400">Ajuste sob medida para a sua operação de campo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Perfil do Representante Externo</label>
              <input
                type="text"
                value={params.repProfile}
                onChange={(e) => setParams({ ...params, repProfile: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Região / Polos de Atuação</label>
              <input
                type="text"
                value={params.region}
                onChange={(e) => setParams({ ...params, region: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Meta Mensal de Contratos Fechados</label>
              <input
                type="number"
                value={params.monthlyGoal}
                onChange={(e) => setParams({ ...params, monthlyGoal: Number(e.target.value) || 20 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Especialidades Médicas Foco</label>
              <input
                type="text"
                value={params.doctorSpecialtyFocus}
                onChange={(e) => setParams({ ...params, doctorSpecialtyFocus: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={params.includeAppsScript}
                  onChange={(e) => setParams({ ...params, includeAppsScript: e.target.checked })}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 h-4 w-4"
                />
                <span>Incluir Google Apps Script de Notificações</span>
              </label>
            </div>

            <div className="flex items-center space-x-3 pt-6">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={params.includeCidMatrix}
                  onChange={(e) => setParams({ ...params, includeCidMatrix: e.target.checked })}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 h-4 w-4"
                />
                <span>Incluir Mapeamento Completo de CIDs</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Viewer Box */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/70 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Google AI Studio • Prompt Master Specification
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-mono">
              {generatedPrompt.length} caracteres • Pronto para envio
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-semibold bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        <div className="p-5 md:p-6 bg-slate-950/40 overflow-x-auto">
          <pre className="font-mono text-xs md:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
            {generatedPrompt}
          </pre>
        </div>
      </div>

      {/* Guide on How to Use in Google AI Studio */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
        <div className="flex items-center space-x-2 text-white font-bold text-base mb-3">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <h3>Como Utilizar Este Prompt no Google AI Studio</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="font-bold text-teal-400 mb-1 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-xs">1</span>
              <span>Copiar & Configurar Modelo</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Clique em <strong>Copiar Prompt</strong>. No Google AI Studio, selecione o modelo <code>gemini-3.8-flash</code> ou <code>gemini-3.1-pro-preview</code> e cole no campo de System Instructions ou User Prompt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="font-bold text-teal-400 mb-1 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-xs">2</span>
              <span>Geração da Planilha & Scripts</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              A IA responderá com a estrutura exata das 5 abas, códigos prontos de Google Apps Script, diálogos mastigados para secretárias e réguas de nutrição temporal em markdown.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <div className="font-bold text-teal-400 mb-1 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-xs">3</span>
              <span>Testar no Assistente Integrado</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Você também pode clicar no botão <strong>Executar com Assistente IA</strong> no topo para testar a resposta e interagir diretamente neste próprio sistema em tempo real!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
