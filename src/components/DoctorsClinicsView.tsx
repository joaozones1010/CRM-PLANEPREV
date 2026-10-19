import React, { useState } from 'react';
import { 
  Stethoscope, 
  Phone, 
  Clock, 
  MapPin, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Search,
  Sparkles
} from 'lucide-react';
import { mockDoctors, DoctorPartner } from '../data/crmSheetsData';
import { medicalSpecialties } from '../data/specialtiesData';

export const DoctorsClinicsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');

  const filteredDoctors = mockDoctors.filter(doc => {
    const matchSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.clinica.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.secretaria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSpecialty = selectedSpecialty === 'Todas' || doc.especialidade.includes(selectedSpecialty);
    return matchSearch && matchSpecialty;
  });

  const openSecretaryWhatsApp = (doc: DoctorPartner) => {
    const text = encodeURIComponent(
      `Olá ${doc.secretaria}, bom dia! Aqui é o representante da PlanePrev. Gostaria de saber se o ${doc.nome} terá alguns minutos no intervalo de atendimento nesta semana para eu repor as cartilhas de direitos do paciente. Muito obrigado!`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${doc.telefoneSecretaria.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Médicos Parceiros & Clínicas</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamento de visitas, contato direto com secretárias (gatekeepers) e horários ideais de abordagem sem atrito.
          </p>
        </div>

        {/* Quick search */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Buscar médico, clínica ou secretária..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Grid of Doctor Cards (Clean, Light, Practical) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doc) => {
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header of Card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {doc.tier}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{doc.nome}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      CRM {doc.crm} • {doc.especialidade}
                    </p>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    doc.status === 'Parceiro Ativo' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                {/* Practical Field Details */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2 text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-900">{doc.clinica}</span>
                    <span className="text-slate-400 text-[11px]">({doc.cidade.split('/')[0]})</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <div className="flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Secretária: <strong className="text-slate-900">{doc.secretaria}</strong></span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{doc.telefoneSecretaria}</span>
                  </div>

                  <div className="flex items-start space-x-1.5 pt-1 border-t border-slate-200 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-[11px]">
                      Melhor Horário: <strong className="text-slate-800">{doc.horarioAbordagem}</strong>
                    </span>
                  </div>
                </div>

                {/* Material in clinic */}
                <div className="text-[11px] text-slate-500">
                  <span className="font-medium text-slate-600 block">Material Deixado na Recepção:</span>
                  <span className="italic">{doc.materialEntregue}</span>
                </div>
              </div>

              {/* Bottom Actions & Stats */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Leads: <strong className="text-slate-800">{doc.leadsGerados}</strong></span>
                  <span className="text-slate-500">Fechados: <strong className="text-emerald-600">{doc.contratosFechados}</strong></span>
                  <span className="text-slate-500">Taxa: <strong className="text-teal-700">{doc.conversao}</strong></span>
                </div>

                <button
                  onClick={() => openSecretaryWhatsApp(doc)}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 border border-slate-200 text-slate-700 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chamar Secretária no WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
