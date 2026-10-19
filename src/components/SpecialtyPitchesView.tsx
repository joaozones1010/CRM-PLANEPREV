import React, { useState } from 'react';
import { 
  Stethoscope, 
  Copy, 
  Check, 
  Sparkles, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';
import { specialtyPitches, SpecialtyPitch } from '../data/b2bProspectingData';

export const SpecialtyPitchesView: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyPitch>(specialtyPitches[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Field variables for fast pitch customization
  const [doctorName, setDoctorName] = useState('Dr. Carlos');
  const [clinicName, setClinicName] = useState('OncoVida');
  const [secretaryName, setSecretaryName] = useState('Fernanda');

  const replaceTags = (text: string) => {
    return text
      .replace(/\[Nome do Médico\]/g, doctorName)
      .replace(/\[Nome do Dr\.\]/g, doctorName)
      .replace(/\[Nome da Secretária\]/g, secretaryName)
      .replace(/\[Nome da Clínica\]/g, clinicName);
  };

  const handleCopy = (type: string, text: string) => {
    navigator.clipboard.writeText(replaceTags(text));
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Scripts &amp; Pitches de Prospecção por Especialidade</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Argumentos técnicos e institucionais para abrir portas com secretárias e fechar termos de cooperação com médicos.
          </p>
        </div>

        {/* Dynamic Name Personalizer */}
        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block">Médico</label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-28"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Clínica</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-28"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block">Secretária</label>
            <input
              type="text"
              value={secretaryName}
              onChange={(e) => setSecretaryName(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-28"
            />
          </div>
        </div>
      </div>

      {/* Specialty Selector Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {specialtyPitches.map((p, idx) => {
          const isSelected = selectedSpecialty.especialidade === p.especialidade;
          return (
            <button
              key={idx}
              onClick={() => setSelectedSpecialty(p)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {p.especialidade.split('&')[0]}
            </button>
          );
        })}
      </div>

      {/* Active Specialty Pitch Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pitches for Secretary & Doctor */}
        <div className="lg:col-span-8 space-y-4">
          {/* Pitch for Doctor */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Pitch para o Médico (Reunião de 90 Segundos)</h3>
              </div>

              <button
                onClick={() => handleCopy('medico', selectedSpecialty.scriptMedico)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 transition cursor-pointer"
              >
                {copiedType === 'medico' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'medico' ? 'Copiado!' : 'Copiar Pitch'}</span>
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-800 leading-relaxed font-sans">
              "{replaceTags(selectedSpecialty.scriptMedico)}"
            </div>
          </div>

          {/* Pitch for Secretary (Gatekeeper) */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Script para a Secretária (Abertura de Porta &amp; Cartilhas)</h3>
              </div>

              <button
                onClick={() => handleCopy('secretaria', selectedSpecialty.scriptSecretaria)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 transition cursor-pointer"
              >
                {copiedType === 'secretaria' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'secretaria' ? 'Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs md:text-sm text-slate-800 leading-relaxed font-sans">
              "{replaceTags(selectedSpecialty.scriptSecretaria)}"
            </div>
          </div>
        </div>

        {/* Right Column: Strategic Insight for the Rep */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-700 block">
                Alinhamento B2B
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedSpecialty.especialidade}</h4>
              <p className="text-xs text-slate-500 mt-1">{selectedSpecialty.perfilClinica}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-900 block">Gancho de Entrada:</span>
              <p className="text-slate-700">{selectedSpecialty.ganchoAbertura}</p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="font-semibold text-slate-900 block">Benefício Concreto para o Médico:</span>
              <p className="text-slate-700">{selectedSpecialty.beneficioParaOMedico}</p>
            </div>

            {/* CFM Ethical badge */}
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-800 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Conformidade Ética com o CFM</span>
              </div>
              <p className="text-[11px] leading-relaxed text-teal-700">
                Lembre o médico que não há repasse financeiro de honorários. A PlanePrev atua estritamente desonerando a clínica e amparando o paciente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
