import React, { useState } from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  DollarSign, 
  Zap, 
  ShieldAlert, 
  MessageSquare, 
  Calculator, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { medicalSpecialties, SpecialtyPriority } from '../data/specialtiesData';

export const SpecialtiesMatrixView: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('Todos');
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyPriority | null>(medicalSpecialties[0]);

  // Simulation state for potential calculator
  const [simOnco, setSimOnco] = useState(3);
  const [simNefro, setSimNefro] = useState(2);
  const [simOrto, setSimOrto] = useState(4);
  const [simCardio, setSimCardio] = useState(2);

  // Projected Monthly Metrics
  // Onco: ~3 leads/doctor/month * 60% conv * R$ 15.000
  // Nefro: ~3 leads/doctor/month * 60% conv * R$ 12.000
  // Orto: ~5 leads/doctor/month * 55% conv * R$ 8.500
  // Cardio: ~2 leads/doctor/month * 45% conv * R$ 14.000
  const projectedLeads = (simOnco * 3) + (simNefro * 3) + (simOrto * 5) + (simCardio * 2);
  const projectedContracts = Math.round((simOnco * 3 * 0.6) + (simNefro * 3 * 0.6) + (simOrto * 5 * 0.55) + (simCardio * 2 * 0.45));
  const projectedRevenue = Math.round(
    (simOnco * 3 * 0.6 * 15000) +
    (simNefro * 3 * 0.6 * 12000) +
    (simOrto * 5 * 0.55 * 8500) +
    (simCardio * 2 * 0.45 * 14000)
  );

  const filteredSpecialties = selectedTier === 'Todos'
    ? medicalSpecialties
    : medicalSpecialties.filter(s => s.tier.includes(selectedTier));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400">
            <Stethoscope className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Matriz Estratégica de Especialidades Médicas</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Priorização analítica baseada em volume de pacientes, ticket médio de honorários, facilidade de prova pericial e conformidade ética com o CFM.
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          {['Todos', 'Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                selectedTier === tier
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List of Specialties + Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Specialties Cards List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {filteredSpecialties.map((spec) => {
            const isSelected = selectedSpecialty?.id === spec.id;
            return (
              <div
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-850 bg-slate-800/90 border-teal-400/80 shadow-lg shadow-teal-500/10 ring-1 ring-teal-400/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border mb-1.5 ${
                      spec.tier.includes('Tier 1')
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : spec.tier.includes('Tier 2')
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}>
                      {spec.tier}
                    </span>
                    <h3 className="text-base font-bold text-white">{spec.nome}</h3>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    spec.urgenciaClinica.includes('Crítica')
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {spec.urgenciaClinica}
                  </span>
                </div>

                {/* Key indicators row */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Ticket Estimado</span>
                    <strong className="text-emerald-400 font-mono text-[11px]">{spec.ticketMedioHonorarios.split('(')[0]}</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Velocidade Ciclo</span>
                    <strong className="text-teal-300 text-[11px]">{spec.velocidadeConversao}</strong>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Volume Pacientes</span>
                    <strong className="text-white text-[11px]">{spec.volumePacientes}</strong>
                  </div>
                </div>

                {/* Services Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {spec.servicosAlvo.map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                      {s.split('(')[0]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Specialty Deep Dive Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedSpecialty && (
            <div className="sticky top-20 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
              <div>
                <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
                  Dossiê Operacional do Representante
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedSpecialty.nome}</h3>
                <p className="text-xs text-slate-400">{selectedSpecialty.tier}</p>
              </div>

              {/* Pitch Hook for Doctor */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-300">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gancho de Abordagem com o Médico</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/30 text-xs text-slate-200 leading-relaxed font-sans italic">
                  "{selectedSpecialty.ganchoAbordagemMedico}"
                </div>
              </div>

              {/* Pitch Hook for Receptionist */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gancho com a Secretária (Gatekeeper)</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 text-xs text-slate-200 leading-relaxed font-sans italic">
                  "{selectedSpecialty.ganchoSecretaria}"
                </div>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block">Vantagens Estratégicas:</span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {selectedSpecialty.pontosFortes.map((p, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ethical Warning */}
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
                <div className="flex items-center space-x-1.5 text-red-300 text-xs font-bold mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Conformidade Ética & CFM</span>
                </div>
                <p className="text-[11px] text-red-200/90 leading-relaxed">
                  {selectedSpecialty.cuidadosEticos}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Opportunity Simulator Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 md:p-8 rounded-2xl border border-teal-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-teal-400">
              <Calculator className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Calculadora de Potencial Comercial por Parcerias Médicas</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Simule a carteira de médicos ativos parceiros do representante e projete o faturamento mensal gerado para a PlanePrev
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            Algoritmo Preditivo de Conversão
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Oncologistas Ativos</label>
            <input
              type="number"
              min="0"
              max="30"
              value={simOnco}
              onChange={(e) => setSimOnco(Number(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Média: R$ 15k / contrato</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nefrologistas Ativos</label>
            <input
              type="number"
              min="0"
              max="30"
              value={simNefro}
              onChange={(e) => setSimNefro(Number(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Média: R$ 12k / contrato</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ortopedistas Ativos</label>
            <input
              type="number"
              min="0"
              max="30"
              value={simOrto}
              onChange={(e) => setSimOrto(Number(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Média: R$ 8.5k (Aux-Acidente)</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cardiologistas Ativos</label>
            <input
              type="number"
              min="0"
              max="30"
              value={simCardio}
              onChange={(e) => setSimCardio(Number(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Média: R$ 14k / contrato</span>
          </div>
        </div>

        {/* Result KPI Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-5 rounded-xl border border-teal-500/30">
          <div>
            <span className="text-xs text-slate-400 block">Leads Clínicos Mensais Estimados</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">{projectedLeads} leads</div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Contratos Fechados Projetados</span>
            <div className="text-2xl font-extrabold text-teal-400 mt-0.5">{projectedContracts} contratos / mês</div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Faturamento Bruto Projetado (Honorários)</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              R$ {projectedRevenue.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
