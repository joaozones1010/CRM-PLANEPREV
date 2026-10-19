import React, { useState } from 'react';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  User, 
  Stethoscope, 
  UserCheck, 
  ShieldCheck, 
  Clock,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { mockFollowUpRules } from '../data/crmSheetsData';
import { objectionCards } from '../data/playbookData';

export const WhatsAppFollowUpView: React.FC = () => {
  const [subTab, setSubTab] = useState<'mensagens' | 'objecoes'>('mensagens');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Field variables for fast replacement
  const [paciente, setPaciente] = useState('Roberto Magalhães');
  const [medico, setMedico] = useState('Dr. Carlos Eduardo');
  const [secretaria, setSecretaria] = useState('Fernanda');
  const [servico, setServico] = useState('Isenção de Imposto de Renda por Doença Grave');
  const [valor, setValor] = useState('R$ 98.000');
  const [repNome, setRepNome] = useState('Lucas Mendes');

  const replaceTags = (text: string) => {
    return text
      .replace(/{{PACIENTE}}/g, paciente)
      .replace(/{{NOME_MEDICO}}/g, medico)
      .replace(/{{SOBRENOME_MEDICO}}/g, medico.split(' ').slice(1).join(' ') || 'Médico')
      .replace(/{{SECRETARIA}}/g, secretaria)
      .replace(/{{SERVICO}}/g, servico)
      .replace(/{{VALOR_ESTIMADO}}/g, valor)
      .replace(/{{REPRESENTANTE}}/g, repNome)
      .replace(/{{DIAGNOSTICO}}/g, 'Neoplasia Maligna')
      .replace(/{{NUMERO_PROCESSO}}/g, '5249.2026.01928');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(replaceTags(text));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Mensagens Prontas para WhatsApp & Objeções</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadência de follow-up testada para pacientes, médicos e secretárias, com personalização em 1 clique.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSubTab('mensagens')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              subTab === 'mensagens' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadência de Follow-Up (D+0 a D+30)
          </button>
          <button
            onClick={() => setSubTab('objecoes')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              subTab === 'objecoes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Respostas para Objeções de Balcão
          </button>
        </div>
      </div>

      {/* SUBTAB 1: MENSAGENS COM TAGS */}
      {subTab === 'mensagens' && (
        <div className="space-y-4">
          {/* Fast Customizer Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Preencha os dados do cliente para personalizar todas as mensagens automaticamente:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Paciente</label>
                <input
                  type="text"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Médico</label>
                <input
                  type="text"
                  value={medico}
                  onChange={(e) => setMedico(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Secretária</label>
                <input
                  type="text"
                  value={secretaria}
                  onChange={(e) => setSecretaria(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Serviço</label>
                <input
                  type="text"
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Valor Estimado</label>
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Seu Nome</label>
                <input
                  type="text"
                  value={repNome}
                  onChange={(e) => setRepNome(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Cards of Messages */}
          <div className="space-y-3">
            {mockFollowUpRules.map((rule, idx) => {
              const formattedMessage = replaceTags(rule.templateScript);
              const cardId = `msg-${idx}`;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                        {rule.momento}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{rule.gatilho}</h4>
                    </div>

                    <span className="text-xs text-slate-500">
                      Destinatário: <strong className="text-slate-800">{rule.destinatario}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Objetivo:</strong> {rule.objetivo}
                  </p>

                  {/* Clean Message Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                      {formattedMessage}
                    </p>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/80">
                      <button
                        onClick={() => handleCopy(cardId, rule.templateScript)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                      >
                        {copiedId === cardId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === cardId ? 'Copiado!' : 'Copiar Texto'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenWhatsApp(rule.templateScript)}
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
      )}

      {/* SUBTAB 2: OBJEÇÕES DE BALCÃO */}
      {subTab === 'objecoes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectionCards.map((card) => {
              const cardId = card.id;

              return (
                <div
                  key={card.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {card.categoria}
                      </span>
                      <span className="text-[11px] text-teal-700 font-medium">Resposta Pronta</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      "{card.objecao}"
                    </h4>

                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed italic">
                      "{card.respostaSugerida}"
                    </div>

                    <p className="text-[11px] text-slate-500">
                      <strong>Por trás da fala:</strong> {card.subtexto}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 italic truncate max-w-xs">
                      {card.dicaPratica}
                    </span>

                    <button
                      onClick={() => handleCopy(cardId, card.respostaSugerida)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      {copiedId === cardId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === cardId ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
