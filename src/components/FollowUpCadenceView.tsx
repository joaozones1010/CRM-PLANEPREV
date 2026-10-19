import React, { useState } from 'react';
import { 
  Clock, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Phone, 
  Mail, 
  Users, 
  Sparkles, 
  ExternalLink,
  CalendarCheck
} from 'lucide-react';
import { mockFollowUpRules, FollowUpRule } from '../data/crmSheetsData';

export const FollowUpCadenceView: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('Todos');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Template variables state
  const [patientName, setPatientName] = useState('Roberto Magalhães');
  const [doctorName, setDoctorName] = useState('Dr. Carlos Eduardo');
  const [serviceName, setServiceName] = useState('Isenção de Imposto de Renda por Doença Grave');
  const [estimatedValue, setEstimatedValue] = useState('R$ 98.000');
  const [repName, setRepName] = useState('Lucas Mendes');
  const [secretariaName, setSecretariaName] = useState('Fernanda');

  const filteredRules = selectedRecipient === 'Todos'
    ? mockFollowUpRules
    : mockFollowUpRules.filter(r => r.destinatario.includes(selectedRecipient));

  const formatScript = (template: string) => {
    return template
      .replace(/{{PACIENTE}}/g, patientName)
      .replace(/{{NOME_MEDICO}}/g, doctorName)
      .replace(/{{SOBRENOME_MEDICO}}/g, doctorName.split(' ').slice(1).join(' ') || 'Médico')
      .replace(/{{SERVICO}}/g, serviceName)
      .replace(/{{VALOR_ESTIMADO}}/g, estimatedValue)
      .replace(/{{REPRESENTANTE}}/g, repName)
      .replace(/{{SECRETARIA}}/g, secretariaName)
      .replace(/{{DIAGNOSTICO}}/g, 'Neoplasia Maligna')
      .replace(/{{NUMERO_PROCESSO}}/g, '5249.2026.01928');
  };

  const handleCopy = (idx: number, script: string) => {
    navigator.clipboard.writeText(formatScript(script));
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleWhatsApp = (script: string) => {
    const text = encodeURIComponent(formatScript(script));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400">
            <Clock className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Cronograma & Cadência Automatizada de Follow-Up</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Régua temporal multicanal (WhatsApp, Ligação e E-mail) para nutrição de leads clínicos, médicos parceiros e secretárias.
          </p>
        </div>

        {/* Filter by recipient */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          {['Todos', 'Paciente', 'Médico', 'Secretária'].map((rec) => (
            <button
              key={rec}
              onClick={() => setSelectedRecipient(rec)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedRecipient === rec
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {rec}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Placeholder Customizer Strip */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-300 mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personalizador Rápido de Parâmetros para Disparo Imediato:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Nome do Paciente</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Médico Parceiro</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Secretária da Clínica</label>
            <input
              type="text"
              value={secretariaName}
              onChange={(e) => setSecretariaName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Serviço Alvo</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Valor Estimado</label>
            <input
              type="text"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5">Seu Nome (Representante)</label>
            <input
              type="text"
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Cadence Timeline Cards */}
      <div className="space-y-4">
        {filteredRules.map((rule, idx) => {
          const personalizedText = formatScript(rule.templateScript);

          return (
            <div key={idx} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="px-3 py-1 rounded-xl font-mono text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {rule.momento}
                  </span>
                  <h3 className="font-bold text-white text-sm">{rule.gatilho}</h3>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">
                    Canal: <strong className="text-slate-200">{rule.canal}</strong>
                  </span>
                  <span className="text-slate-400">
                    Destinatário: <strong className="text-teal-300">{rule.destinatario}</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Objetivo:</span> {rule.objetivo}
              </p>

              {/* Message Box with Instant Actions */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    Mensagem Pronta Personalizada:
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(idx, rule.templateScript)}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 transition cursor-pointer"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-teal-300" /> : <Copy className="w-3.5 h-3.5 text-teal-300" />}
                      <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => handleWhatsApp(rule.templateScript)}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/40 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Abrir no WhatsApp</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs md:text-sm font-sans text-slate-100 whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {personalizedText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
