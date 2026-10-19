import React, { useState } from 'react';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  UserCheck, 
  Stethoscope, 
  Building2
} from 'lucide-react';
import { b2bFollowUpCadence } from '../data/b2bProspectingData';

export const B2BFollowUpView: React.FC = () => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Field variables
  const [medico, setMedico] = useState('Dr. Carlos Eduardo');
  const [clinica, setClinica] = useState('Instituto OncoVida');
  const [secretaria, setSecretaria] = useState('Fernanda');
  const [horario, setHorario] = useState('11h30');
  const [repNome, setRepNome] = useState('Lucas');

  const replaceTags = (text: string) => {
    return text
      .replace(/{{NOME_MEDICO}}/g, medico)
      .replace(/{{SOBRENOME_MEDICO}}/g, medico.split(' ').slice(1).join(' ') || 'Médico')
      .replace(/{{CLINICA}}/g, clinica)
      .replace(/{{SECRETARIA}}/g, secretaria)
      .replace(/{{HORARIO}}/g, horario)
      .replace(/{{REPRESENTANTE}}/g, repNome);
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(replaceTags(text));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(replaceTags(text));
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Cadência de Follow-Up com Médicos &amp; Clínicas</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Régua de mensagens para garantir o comparecimento nas visitas, envio do termo de parceria e reposição de materiais.
          </p>
        </div>

        {/* Dynamic Personalizer */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block">Médico</label>
            <input
              type="text"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-28"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Clínica</label>
            <input
              type="text"
              value={clinica}
              onChange={(e) => setClinica(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-28"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Secretária</label>
            <input
              type="text"
              value={secretaria}
              onChange={(e) => setSecretaria(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-28"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Horário</label>
            <input
              type="text"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-20"
            />
          </div>
        </div>
      </div>

      {/* Cadence Cards List */}
      <div className="space-y-3.5">
        {b2bFollowUpCadence.map((item, idx) => {
          const personalizedText = replaceTags(item.template);

          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    {item.momento}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{item.fase}</h4>
                </div>

                <span className="text-xs text-slate-500">
                  Destinatário: <strong className="text-slate-800">{item.destinatario}</strong>
                </span>
              </div>

              <p className="text-xs text-slate-600">
                <strong>Objetivo Estratégico:</strong> {item.objetivo}
              </p>

              {/* Message Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs md:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {personalizedText}
                </p>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/80">
                  <button
                    onClick={() => handleCopy(idx, item.template)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIdx === idx ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenWhatsApp(item.template)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir no WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
