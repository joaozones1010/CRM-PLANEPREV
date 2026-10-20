import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  MessageSquare, 
  Stethoscope, 
  Plus, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { DoctorProspect, getStoredProspects, saveStoredProspects } from '../data/b2bProspectingData';
import { getDoctorsList, updateDoctorRecord } from '../lib/doctorService';

interface DailyRouteViewProps {
  onGoToPipeline?: () => void;
}

export const DailyRouteView: React.FC<DailyRouteViewProps> = ({ onGoToPipeline }) => {
  const [prospects, setProspects] = useState<DoctorProspect[]>(() => getStoredProspects());

  // Carrega médicos do Supabase ou cache local no mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      const data = await getDoctorsList();
      if (mounted) {
        setProspects(data);
      }
    }
    loadData();

    const handleStorage = () => {
      setProspects(getStoredProspects());
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      mounted = false;
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: DoctorProspect['statusParceria']) => {
    const today = new Date().toISOString().split('T')[0];
    const target = prospects.find(p => p.id === id);
    if (!target) return;

    const updatedDoc: DoctorProspect = {
      ...target,
      statusParceria: newStatus,
      dataUltimaVisita: today,
    };

    const updated = prospects.map(p => p.id === id ? updatedDoc : p);
    setProspects(updated);
    saveStoredProspects(updated);

    // Sincroniza no Supabase
    await updateDoctorRecord(updatedDoc);
  };

  const openSecretaryWhatsApp = (p: DoctorProspect) => {
    const text = encodeURIComponent(
      `Olá ${p.secretaria}, bom dia! Aqui é o representante da PlanePrev. Gostaria de confirmar nossa breve visita ao ${p.nome} hoje no horário de ${p.melhorHorario}. Serão apenas 5 minutos para apresentar nossa cooperação técnica. Muito obrigado!`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${p.telefoneSecretaria.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  const openDoctorWhatsApp = (p: DoctorProspect) => {
    const text = encodeURIComponent(
      `Olá ${p.nome}, tudo bem? Sou o representante institucional da PlanePrev. Combinamos com a ${p.secretaria} uma breve conversa para apresentar nossa assessoria técnica de apoio aos pacientes da clínica. Estou à disposição!`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${p.telefoneMedico.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  const closedCount = prospects.filter(p => p.statusParceria === 'Parceria Fechada').length;
  const inNegotiationCount = prospects.filter(p => p.statusParceria === 'Visita Realizada' || p.statusParceria === 'Proposta Enviada' || p.statusParceria === '1ª Visita Agendada').length;

  return (
    <div className="space-y-6">
      {/* Top Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Visitas em Andamento</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{inNegotiationCount} clínicas</div>
          <span className="text-[11px] text-teal-600 font-medium">Contatos agendados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Parcerias Fechadas</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{closedCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Clínicas ativas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Total Mapeado na Carteira</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{prospects.length} médicos</div>
          <span className="text-[11px] text-slate-500 font-medium">Em prospecção</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Meta do Mês</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">20 parcerias</div>
          <span className="text-[11px] text-slate-500 font-medium">Novos médicos parceiros</span>
        </div>
      </div>

      {/* Roteiro Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Meu Roteiro de Visitas Médicas</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Clínicas cadastradas para você visitar e fazer follow-up hoje.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
            {prospects.length} clínicas na carteira
          </span>
          {onGoToPipeline && (
            <button
              onClick={onGoToPipeline}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Gerenciar Carteira</span>
            </button>
          )}
        </div>
      </div>

      {/* Roteiro Cards */}
      {prospects.length > 0 ? (
        <div className="space-y-3.5">
          {prospects.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-3.5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Doctor & Clinic Info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{doc.nome}</span>
                    <span className="text-xs text-slate-500">CRM {doc.crm}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {doc.especialidade}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-600">
                    <span className="flex items-center space-x-1 font-semibold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{doc.clinica}</span>
                    </span>
                    {doc.endereco && (
                      <span className="flex items-center space-x-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{doc.endereco} {doc.cidadeBairro ? `(${doc.cidadeBairro})` : ''}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs pt-1">
                    <span className="text-slate-600">
                      Secretária: <strong className="text-slate-900 font-semibold">{doc.secretaria}</strong>
                    </span>
                    <span className="text-amber-700 font-medium flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Melhor Horário: <strong>{doc.melhorHorario}</strong></span>
                    </span>
                  </div>
                </div>

                {/* Status & Quick Actions */}
                <div className="flex flex-wrap items-center gap-2 md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <select
                    value={doc.statusParceria}
                    onChange={(e) => handleStatusChange(doc.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Mapeamento">Mapeamento</option>
                    <option value="1ª Visita Agendada">1ª Visita Agendada</option>
                    <option value="Visita Realizada">Visita Realizada</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Parceria Fechada">Parceria Fechada</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                  </select>

                  <button
                    onClick={() => openSecretaryWhatsApp(doc)}
                    disabled={!doc.telefoneSecretaria}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 border border-emerald-200 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Secretária</span>
                  </button>

                  {doc.telefoneMedico && (
                    <button
                      onClick={() => openDoctorWhatsApp(doc)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>WhatsApp Médico</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Practical Notes & Materials */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                <div>
                  <span className="font-medium text-slate-800">Anotações: </span>
                  <span>{doc.observacoes || 'Sem anotações adicionais.'}</span>
                </div>
                <div className="text-[11px] text-slate-500 whitespace-nowrap">
                  Material na Clínica: <strong className="text-slate-700">{doc.materialEntregue}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Clean */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
            <Calendar className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">Seu Roteiro de Visitas está limpo e pronto</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Você ainda não tem médicos cadastrados. Cadastre as clínicas que pretende prospectar na aba "Carteira de Médicos &amp; Clínicas" para que elas apareçam aqui no seu roteiro diário de visitas.
            </p>
          </div>

          {onGoToPipeline && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={onGoToPipeline}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Médico / Clínica Agora</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
