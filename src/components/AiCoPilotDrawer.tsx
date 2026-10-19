import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2,
  Stethoscope,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

interface AiCoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AiCoPilotDrawer: React.FC<AiCoPilotDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const userPrompt = textToSend || prompt;
    if (!userPrompt.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResponse('');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          systemInstruction: 'Você é o Diretor Comercial & Especialista em Automação de Processos e CRM da PlanePrev. Domina profundamente a Lei Federal 7.713/88 (Isenção de IR por Doença Grave), Lei 8.213/91 (Auxílio-Acidente), BPC/LOAS e Planejamento Previdenciário Médico. Responda de forma altamente prática, técnica, elegante e pronta para o representante externo usar em campo.'
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro na comunicação com a IA.');
      }

      setResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Não foi possível gerar a resposta neste momento.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePrompts = [
    {
      title: "Pitch p/ Diretor de Clínica Oncológica",
      text: "Crie um pitch de 2 minutos para o representante da PlanePrev apresentar ao Diretor Clínico de um Centro de Oncologia, propondo uma cooperação institucional para disponibilização de cartilhas aos pacientes e laudos padrão, com conformidade total ao CFM."
    },
    {
      title: "Objeção: 'Médico não atende'",
      text: "Simule 3 abordagens elegantes com a secretária que diz: 'O doutor não atende consultorias'. Mostre como transformar a secretária em parceira para receber o display e as cartilhas gratuitas na recepção."
    },
    {
      title: "Termo de Parceria sem Custos",
      text: "Elabore uma minuta simples e executiva de Termo de Cooperação Técnica Institucional entre a PlanePrev e uma Clínica Médica, destacando a ausência de ônus financeiro e respeito estrito ao Código de Ética Médica."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
              <Bot className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <span>Assistente IA Especialista PlanePrev</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-teal-100 text-teal-800">
                  Gemini Flash
                </span>
              </h3>
              <p className="text-xs text-slate-500">Apoio em laudos, cálculos de 5 anos de IRPF e argumentos de campo</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 overflow-x-auto flex gap-2 scrollbar-none">
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(sp.text);
                handleSend(sp.text);
              }}
              className="px-2.5 py-1 rounded-md text-xs bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 whitespace-nowrap transition cursor-pointer shadow-2xs"
            >
              {sp.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <span className="font-bold block mb-1">Aviso:</span>
              {errorMsg}
            </div>
          )}

          {response ? (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider">
                  Resposta do Co-Pilot Especialista
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-teal-700 cursor-pointer font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              <div className="text-xs md:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {response}
              </div>
            </div>
          ) : !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <Sparkles className="w-10 h-10 text-teal-500/40 mb-3" />
              <h4 className="text-sm font-semibold text-slate-800 mb-1">Em que posso te ajudar hoje?</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Tire dúvidas sobre prazos de restituição do IRPF, requisitos de laudos do INSS ou simule respostas para secretárias exigentes.
              </p>
            </div>
          ) : null}

          {loading && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-xs font-mono">Consultando inteligência clínica e jurídica...</p>
            </div>
          )}
        </div>

        {/* Prompt Input Box */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Digite sua dúvida ou instrução para o especialista PlanePrev..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-12 py-3 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 resize-none shadow-2xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !prompt.trim()}
              className="absolute right-2.5 bottom-3.5 p-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white transition cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Pressione Ctrl + Enter para enviar</span>
            <span>PlanePrev AI Hub • Modo Claro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
