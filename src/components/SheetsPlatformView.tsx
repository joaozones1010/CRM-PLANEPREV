import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Code, 
  Copy, 
  Check, 
  Plus, 
  AlertCircle,
  Stethoscope,
  TrendingUp,
  Clock,
  UserCheck,
  CheckCircle2,
  DollarSign,
  Send
} from 'lucide-react';
import { 
  mockLeads, 
  mockDoctors, 
  mockCidLaws, 
  mockFollowUpRules, 
  googleAppsScriptTemplate, 
  generateCsv,
  LeadItem
} from '../data/crmSheetsData';

export const SheetsPlatformView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'medicos' | 'cids' | 'followup' | 'kpis' | 'script'>('pipeline');
  const [leads, setLeads] = useState<LeadItem[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('Todos');
  const [filterUrgency, setFilterUrgency] = useState('Todos');
  const [copiedScript, setCopiedScript] = useState(false);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.medicoIndicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.diagnosticoCid.toLowerCase().includes(searchTerm.toLowerCase());
      const matchService = filterService === 'Todos' || l.servico === filterService;
      const matchUrgency = filterUrgency === 'Todos' || l.urgencia === filterUrgency;
      return matchSearch && matchService && matchUrgency;
    });
  }, [leads, searchTerm, filterService, filterUrgency]);

  // Update lead status in state
  const handleStatusChange = (id: string, newStatus: LeadItem['status']) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        return { ...lead, status: newStatus, dataUltimoContato: new Date().toISOString().split('T')[0] };
      }
      return lead;
    }));
  };

  const handleDownloadCsv = (sheetKey: 'pipeline' | 'medicos' | 'cids' | 'followup') => {
    const csvContent = generateCsv(sheetKey);
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PlanePrev_CRM_${sheetKey}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptTemplate);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  // KPI Calculations
  const totalPipelineValue = leads.reduce((acc, curr) => acc + curr.honorariosEstimados, 0);
  const totalClosedContracts = leads.filter(l => l.status === 'Contrato Fechado' || l.status === 'Protocolado' || l.status === 'Concluído').length;
  const p1LeadsCount = leads.filter(l => l.urgencia === 'P1-Crítica').length;

  return (
    <div className="space-y-6">
      {/* Top Bar with Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white">Plataforma Google Sheets CRM PlanePrev</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Estrutura relacional de 5 abas, dicionário de dados, fórmulas automáticas e exportação CSV
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab !== 'kpis' && activeSubTab !== 'script' && (
            <button
              onClick={() => handleDownloadCsv(activeSubTab as any)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Baixar CSV desta Aba</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('script')}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'script'
                ? 'bg-teal-500 text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Google Apps Script</span>
          </button>
        </div>
      </div>

      {/* Sheets Tab Switcher Navigation */}
      <div className="flex space-x-1 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'pipeline'
              ? 'bg-slate-800 text-teal-300 border-t-2 border-teal-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          01_Pipeline_Leads ({leads.length})
        </button>

        <button
          onClick={() => setActiveSubTab('medicos')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'medicos'
              ? 'bg-slate-800 text-teal-300 border-t-2 border-teal-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          02_Medicos_e_Clinicas ({mockDoctors.length})
        </button>

        <button
          onClick={() => setActiveSubTab('cids')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'cids'
              ? 'bg-slate-800 text-teal-300 border-t-2 border-teal-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          03_Matriz_CIDs_Previdenciario ({mockCidLaws.length})
        </button>

        <button
          onClick={() => setActiveSubTab('followup')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'followup'
              ? 'bg-slate-800 text-teal-300 border-t-2 border-teal-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          04_Regua_FollowUp ({mockFollowUpRules.length})
        </button>

        <button
          onClick={() => setActiveSubTab('kpis')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
            activeSubTab === 'kpis'
              ? 'bg-slate-800 text-teal-300 border-t-2 border-teal-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          05_Dashboard_KPIs
        </button>
      </div>

      {/* SUBTAB 1: PIPELINE */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por paciente, médico parceiro ou CID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Todos">Todos os Serviços</option>
                <option value="Isenção IR Moléstia Grave">Isenção IR Moléstia Grave</option>
                <option value="Auxílio-Acidente">Auxílio-Acidente</option>
                <option value="BPC/LOAS">BPC/LOAS</option>
                <option value="Planejamento Previdenciário">Planejamento Previdenciário</option>
              </select>

              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              >
                <option value="Todos">Todas Urgências</option>
                <option value="P1-Crítica">P1-Crítica (Vermelho)</option>
                <option value="P2-Alta">P2-Alta (Laranja)</option>
                <option value="P3-Moderada">P3-Moderada (Amarelo)</option>
                <option value="P4-Estratégica">P4-Estratégica (Azul)</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">ID & Data</th>
                    <th className="py-3 px-3">Paciente / Idade</th>
                    <th className="py-3 px-3">Regime & Contato</th>
                    <th className="py-3 px-3">Médico / Clínica</th>
                    <th className="py-3 px-3">Serviço PlanePrev</th>
                    <th className="py-3 px-3">CID & Diagnóstico</th>
                    <th className="py-3 px-3">Urgência</th>
                    <th className="py-3 px-3">Status do Funil</th>
                    <th className="py-3 px-3 text-right">Honorários R$</th>
                    <th className="py-3 px-3">Próx. Follow-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredLeads.map((lead) => {
                    const urgencyBadge = {
                      'P1-Crítica': 'bg-red-500/20 text-red-300 border-red-500/40',
                      'P2-Alta': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      'P3-Moderada': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
                      'P4-Estratégica': 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }[lead.urgencia];

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-semibold text-slate-400">
                          <div>{lead.id}</div>
                          <div className="text-[10px] text-slate-500">{lead.dataEntrada}</div>
                        </td>
                        <td className="py-3 px-3 font-sans font-medium text-white">
                          <div>{lead.paciente}</div>
                          <div className="text-[11px] text-slate-400">{lead.idade} anos</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-teal-400 font-sans">{lead.regime}</div>
                          <div className="text-[10px] text-slate-400">{lead.telefone}</div>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <div className="text-slate-200 font-semibold">{lead.medicoIndicador}</div>
                          <div className="text-[10px] text-slate-400">{lead.clinica}</div>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-medium text-[11px]">
                            {lead.servico}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300 text-[11px] max-w-xs">
                          {lead.diagnosticoCid}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${urgencyBadge}`}>
                            {lead.urgencia}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
                          >
                            <option value="Novo Lead">Novo Lead</option>
                            <option value="Triagem Inicial">Triagem Inicial</option>
                            <option value="Laudo em Análise">Laudo em Análise</option>
                            <option value="Proposta Enviada">Proposta Enviada</option>
                            <option value="Contrato Fechado">Contrato Fechado</option>
                            <option value="Protocolado">Protocolado</option>
                            <option value="Concluído">Concluído</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                          R$ {lead.honorariosEstimados.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-amber-300 font-medium">
                            {lead.proximoFollowUp}
                          </span>
                          <div className="text-[10px] text-slate-400">{lead.canal}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredLeads.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhum lead encontrado com os filtros selecionados.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: MEDICOS E CLINICAS */}
      {activeSubTab === 'medicos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDoctors.map((doc) => (
              <div key={doc.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {doc.tier}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1">{doc.nome}</h3>
                    <p className="text-xs text-slate-400">CRM: {doc.crm} • {doc.especialidade}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    doc.status === 'Parceiro Ativo' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Clínica:</span>
                    <span className="text-white font-semibold">{doc.clinica}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Secretária-Chave:</span>
                    <span className="text-teal-300 font-semibold">{doc.secretaria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Telefone Direto:</span>
                    <span>{doc.telefoneSecretaria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Melhor Horário:</span>
                    <span className="text-amber-300 font-sans text-[11px]">{doc.horarioAbordagem}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Leads Gerados:</span>{' '}
                    <strong className="text-white">{doc.leadsGerados}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Fechados:</span>{' '}
                    <strong className="text-emerald-400">{doc.contratosFechados}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Conversão:</span>{' '}
                    <strong className="text-teal-300">{doc.conversao}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MATRIZ DE CIDS */}
      {activeSubTab === 'cids' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Código CID-10</th>
                    <th className="py-3 px-3">Patologia Clínica</th>
                    <th className="py-3 px-3">Serviço PlanePrev</th>
                    <th className="py-3 px-3">Enquadramento Legal</th>
                    <th className="py-3 px-3">Urgência</th>
                    <th className="py-3 px-3">Documentos Mandatórios</th>
                    <th className="py-3 px-3">Súmula / Jurisprudência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {mockCidLaws.map((cid, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-teal-400 whitespace-nowrap">{cid.cid}</td>
                      <td className="py-3 px-3 font-semibold text-white">{cid.patologia}</td>
                      <td className="py-3 px-3 text-slate-200">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 text-[11px] font-medium">
                          {cid.servico}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-300">{cid.enquadramentoLegal}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          cid.urgencia === 'P1-Crítica' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {cid.urgencia}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs">{cid.documentosMandatorios}</td>
                      <td className="py-3 px-3 text-[11px] text-slate-400 max-w-sm italic">{cid.jurisprudencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: REGUA DE FOLLOW-UP */}
      {activeSubTab === 'followup' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {mockFollowUpRules.map((rule, idx) => (
              <div key={idx} className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {rule.momento}
                    </span>
                    <h3 className="text-sm font-bold text-white">{rule.gatilho}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span>Canal: <strong className="text-slate-200">{rule.canal}</strong></span>
                    <span>• Destinatário: <strong className="text-teal-300">{rule.destinatario}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">Objetivo Estratégico:</span> {rule.objetivo}
                </p>

                <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                      Script Pronto de Envio (Copiar e Personalizar)
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(rule.templateScript)}
                      className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center space-x-1 cursor-pointer font-semibold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Script</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {rule.templateScript}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: KPIS & METAS */}
      {activeSubTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Pipeline Ativo</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                R$ {totalPipelineValue.toLocaleString('pt-BR')}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Em {leads.length} casos em negociação</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Contratos Fechados/Mês</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-extrabold text-teal-400">
                {totalClosedContracts} <span className="text-xs font-normal text-slate-400">/ 35 meta</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-teal-400 h-full rounded-full" 
                  style={{ width: `${Math.min(100, (totalClosedContracts / 35) * 100)}%` }} 
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Leads P1-Crítica</span>
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-extrabold text-red-400">
                {p1LeadsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">SLA de atendimento imediato &lt; 12h</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Médicos Parceiros Ativos</span>
                <Stethoscope className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {mockDoctors.filter(d => d.status === 'Parceiro Ativo').length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Geração recorrente de casos clínicos</p>
            </div>
          </div>

          {/* Breakdown by Service */}
          <div className="rounded-xl bg-slate-900 p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">Fórmulas Essenciais Configuradas no Google Sheets</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-teal-400 font-bold block mb-1">Alerta Automático de Follow-Up Vencido:</span>
                <code>=IFS(ISBLANK(P2); ""; P2 &lt; TODAY(); "VENCIDO - AGIR"; P2 = TODAY(); "HOJE"; TRUE; "NO PRAZO")</code>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-teal-400 font-bold block mb-1">Contagem Automática de Leads por Médico:</span>
                <code>=COUNTIF('01_Pipeline_Leads'!G:G; B2)</code>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-teal-400 font-bold block mb-1">Taxa de Conversão por Especialidade:</span>
                <code>=COUNTIFS('01_Pipeline_Leads'!I:I; "Oncologia"; '01_Pipeline_Leads'!M:M; "Contrato Fechado") / COUNTIF('01_Pipeline_Leads'!I:I; "Oncologia")</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: GOOGLE APPS SCRIPT CODE */}
      {activeSubTab === 'script' && (
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Código Completo Google Apps Script</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automatiza alertas de e-mail diários, detecção de urgência P1 e monitoramento de follow-ups
                </p>
              </div>

              <button
                onClick={handleCopyScript}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition cursor-pointer"
              >
                {copiedScript ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                <span>{copiedScript ? 'Código Copiado!' : 'Copiar Apps Script'}</span>
              </button>
            </div>

            <div className="mt-4 bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-800">
              <pre className="font-mono text-xs text-teal-300 leading-relaxed whitespace-pre-wrap">
                {googleAppsScriptTemplate}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
