import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  User,
  HeartPulse,
  Scale
} from 'lucide-react';
import { 
  urgencyTiers, 
  evaluateLeadQualification, 
  LeadQualificationInput 
} from '../data/qualificationFlowData';

export const ClinicalQualifierView: React.FC = () => {
  // Input State for Triage Simulator
  const [formData, setFormData] = useState<LeadQualificationInput>({
    regime: 'Aposentado INSS',
    diagnostico: 'Neoplasia Maligna (Câncer)',
    anoDiagnostico: 2022,
    idade: 67,
    rendaFamiliarPerCapita: 3500,
    sofreuAcidenteComSequela: false,
    temRetencaoIRPF: true,
    eMedicoOuProfissionalSaude: false,
  });

  const triageResult = useMemo(() => {
    return evaluateLeadQualification(formData);
  }, [formData]);

  const presetScenarios = [
    {
      name: "Oncologia (Aposentado c/ Câncer)",
      data: {
        regime: 'Aposentado INSS',
        diagnostico: 'Neoplasia Maligna de Próstata (Câncer)',
        anoDiagnostico: 2021,
        idade: 68,
        rendaFamiliarPerCapita: 4200,
        sofreuAcidenteComSequela: false,
        temRetencaoIRPF: true,
        eMedicoOuProfissionalSaude: false,
      }
    },
    {
      name: "Ortopedia (CLT c/ Fratura e Sequela)",
      data: {
        regime: 'CLT Ativo',
        diagnostico: 'Fratura de Platô Tibial c/ limitação de flexão',
        anoDiagnostico: 2024,
        idade: 36,
        rendaFamiliarPerCapita: 2100,
        sofreuAcidenteComSequela: true,
        temRetencaoIRPF: false,
        eMedicoOuProfissionalSaude: false,
      }
    },
    {
      name: "Nefrologia (BPC/LOAS Hemodiálise)",
      data: {
        regime: 'Sem Contribuição',
        diagnostico: 'Insuficiência Renal Crônica Estágio 5',
        anoDiagnostico: 2025,
        idade: 59,
        rendaFamiliarPerCapita: 320,
        sofreuAcidenteComSequela: false,
        temRetencaoIRPF: false,
        eMedicoOuProfissionalSaude: false,
      }
    },
    {
      name: "Médico Cirurgião (Planejamento)",
      data: {
        regime: 'Médico/PJ',
        diagnostico: 'Sem patologia (Planejamento Previdenciário)',
        anoDiagnostico: 2026,
        idade: 53,
        rendaFamiliarPerCapita: 25000,
        sofreuAcidenteComSequela: false,
        temRetencaoIRPF: true,
        eMedicoOuProfissionalSaude: true,
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400">
            <Activity className="w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Motor de Triagem & Qualificação Clínica de Leads</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algoritmo inteligente de enquadramento previdenciário e tributário fundamentado na Lei 7.713/88, Lei 8.213/91 e jurisprudência do STJ.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-teal-300 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">
          <Clock className="w-3.5 h-3.5" />
          <span>Matriz de SLAs P1 a P4</span>
        </div>
      </div>

      {/* 4 Urgency Tiers Quick Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {urgencyTiers.map((tier) => (
          <div key={tier.tier} className="bg-slate-900 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${tier.corBadge}`}>
                {tier.tier}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                SLA: &lt; {tier.slaHoras}h
              </span>
            </div>
            <h4 className="text-xs font-bold text-white leading-snug">{tier.nome}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-3">
              {tier.descricaoClinica}
            </p>
          </div>
        ))}
      </div>

      {/* Interactive Simulator: Inputs (Left) and Live Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Simulador de Triagem em Tempo Real
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {presetScenarios.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setFormData(preset.data)}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Regime Previdenciário do Paciente</label>
              <select
                value={formData.regime}
                onChange={(e) => setFormData({ ...formData, regime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
              >
                <option value="Aposentado INSS">Aposentado INSS</option>
                <option value="Pensionista INSS">Pensionista INSS</option>
                <option value="Servidor RPPS">Servidor Público RPPS</option>
                <option value="CLT Ativo">Trabalhador CLT Ativo</option>
                <option value="Sem Contribuição">Sem Contribuição / Desempregado</option>
                <option value="Médico/PJ">Médico / Sócio de Clínica (PJ)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Diagnóstico Clínico / CID</label>
              <input
                type="text"
                value={formData.diagnostico}
                onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
                placeholder="Ex: Neoplasia Maligna de Próstata, Infarto, Fratura de Fêmur..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Ano do Diagnóstico</label>
                <input
                  type="number"
                  min="2010"
                  max="2026"
                  value={formData.anoDiagnostico}
                  onChange={(e) => setFormData({ ...formData, anoDiagnostico: Number(e.target.value) || 2024 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Idade do Paciente</label>
                <input
                  type="number"
                  min="0"
                  max="110"
                  value={formData.idade}
                  onChange={(e) => setFormData({ ...formData, idade: Number(e.target.value) || 60 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Renda Familiar per capita (R$)</label>
              <input
                type="number"
                value={formData.rendaFamiliarPerCapita}
                onChange={(e) => setFormData({ ...formData, rendaFamiliarPerCapita: Number(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.temRetencaoIRPF}
                  onChange={(e) => setFormData({ ...formData, temRetencaoIRPF: e.target.checked })}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 h-4 w-4"
                />
                <span>Paga Imposto de Renda Retido na Fonte (IRRF)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.sofreuAcidenteComSequela}
                  onChange={(e) => setFormData({ ...formData, sofreuAcidenteComSequela: e.target.checked })}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 h-4 w-4"
                />
                <span>Sofreu acidente de qualquer natureza com sequela permanente</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.eMedicoOuProfissionalSaude}
                  onChange={(e) => setFormData({ ...formData, eMedicoOuProfissionalSaude: e.target.checked })}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 h-4 w-4"
                />
                <span>É médico ou profissional de saúde</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Qualification Results (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-slate-400">Resultado do Enquadramento:</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${triageResult.tier.corBadge}`}>
                  {triageResult.tier.tier}
                </span>
                <h3 className="text-base font-bold text-white">{triageResult.tier.nome}</h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">Viabilidade Técnica</span>
              <span className="text-lg font-extrabold text-teal-400 font-mono">
                {triageResult.scoreViabilidade}%
              </span>
            </div>
          </div>

          {/* Financial Potential Estimate */}
          <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold">
              <DollarSign className="w-4 h-4" />
              <span>Estimativa Econômica para o Cliente</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {triageResult.estimativaEconomica}
            </p>
          </div>

          {/* Recommended PlanePrev Services */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">Serviços PlanePrev Elegíveis:</span>
            <div className="space-y-1.5">
              {triageResult.servicosRecomendados.map((srv, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{srv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Medical Documents Checklist */}
          <div>
            <span className="text-xs font-bold text-slate-300 block mb-2">Documentação Clínica Obrigatória a Solicitar:</span>
            <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
              {triageResult.documentosChave.map((doc, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Representative Action Command */}
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30">
            <div className="flex items-center space-x-1.5 text-teal-300 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Diretriz Imediata para o Representante em Campo:</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {triageResult.orientacaoAoRepresentante}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
