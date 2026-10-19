import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  FileText, 
  X,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { mockLeads, LeadItem } from '../data/crmSheetsData';

export const DailyLeadsView: React.FC = () => {
  const [leads, setLeads] = useState<LeadItem[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('Todos');
  const [urgencyFilter, setUrgencyFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // New Lead Form State
  const [newLead, setNewLead] = useState<Partial<LeadItem>>({
    paciente: '',
    idade: 60,
    telefone: '',
    regime: 'Aposentado INSS',
    medicoIndicador: '',
    clinica: '',
    especialidade: 'Oncologia',
    servico: 'Isenção IR Moléstia Grave',
    diagnosticoCid: '',
    urgencia: 'P1-Crítica',
    status: 'Novo Lead',
    honorariosEstimados: 12000,
    observacoes: '',
  });

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.medicoIndicador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.diagnosticoCid.toLowerCase().includes(searchTerm.toLowerCase());
      const matchService = serviceFilter === 'Todos' || l.servico === serviceFilter;
      const matchUrgency = urgencyFilter === 'Todos' || l.urgencia === urgencyFilter;
      return matchSearch && matchService && matchUrgency;
    });
  }, [leads, searchTerm, serviceFilter, urgencyFilter]);

  const handleStatusChange = (id: string, newStatus: LeadItem['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.paciente) return;

    const created: LeadItem = {
      id: `PLP-2026-${String(leads.length + 1).padStart(3, '0')}`,
      dataEntrada: new Date().toISOString().split('T')[0],
      paciente: newLead.paciente || '',
      idade: Number(newLead.idade) || 50,
      telefone: newLead.telefone || '(11) 99999-0000',
      regime: (newLead.regime as any) || 'Aposentado INSS',
      medicoIndicador: newLead.medicoIndicador || 'Indicação Externa',
      clinica: newLead.clinica || 'Clínica Parceira',
      especialidade: newLead.especialidade || 'Oncologia',
      servico: (newLead.servico as any) || 'Isenção IR Moléstia Grave',
      diagnosticoCid: newLead.diagnosticoCid || 'Em investigação clínica',
      urgencia: (newLead.urgencia as any) || 'P1-Crítica',
      status: 'Novo Lead',
      honorariosEstimados: Number(newLead.honorariosEstimados) || 8000,
      dataUltimoContato: new Date().toISOString().split('T')[0],
      proximoFollowUp: new Date().toISOString().split('T')[0],
      canal: 'WhatsApp',
      checklistDocs: 'Pendente',
      observacoes: newLead.observacoes || 'Cadastrado pelo representante em campo.'
    };

    setLeads([created, ...leads]);
    setIsModalOpen(false);
    setNewLead({
      paciente: '',
      idade: 60,
      telefone: '',
      regime: 'Aposentado INSS',
      medicoIndicador: '',
      clinica: '',
      especialidade: 'Oncologia',
      servico: 'Isenção IR Moléstia Grave',
      diagnosticoCid: '',
      urgencia: 'P1-Crítica',
      status: 'Novo Lead',
      honorariosEstimados: 12000,
      observacoes: '',
    });
  };

  const openWhatsApp = (lead: LeadItem) => {
    const text = encodeURIComponent(
      `Olá ${lead.paciente}, tudo bem? Sou o representante da PlanePrev. O ${lead.medicoIndicador} nos indicou seu caso referente ao seu tratamento clínico. Gostaria de analisar gratuitamente seu direito à ${lead.servico}. Podemos conversar por 5 minutos?`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${lead.telefone.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  // Quick Metrics
  const totalValue = leads.reduce((acc, curr) => acc + curr.honorariosEstimados, 0);
  const p1Count = leads.filter(l => l.urgencia === 'P1-Crítica').length;
  const closedCount = leads.filter(l => l.status === 'Contrato Fechado' || l.status === 'Protocolado').length;

  return (
    <div className="space-y-6">
      {/* Overview Cards (Light, Clean, Uncluttered) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Total de Casos no Funil</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{leads.length} leads</div>
          <span className="text-[11px] text-teal-600 font-medium">Atendimento ativo</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Urgência Crítica (P1)</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{p1Count} casos</div>
          <span className="text-[11px] text-red-500 font-medium">SLA de contato &lt; 12h</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Contratos Fechados</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{closedCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Meta do mês: 35</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 block">Honorários em Carteira</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            R$ {totalValue.toLocaleString('pt-BR')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Previsão no êxito</span>
        </div>
      </div>

      {/* Action Bar: Search, Filters & Add Lead */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar paciente, CID ou médico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lead Rápido</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 text-[11px] mr-1">Serviço:</span>
          {['Todos', 'Isenção IR Moléstia Grave', 'Auxílio-Acidente', 'BPC/LOAS', 'Planejamento Previdenciário'].map((svc) => (
            <button
              key={svc}
              onClick={() => setServiceFilter(svc)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer ${
                serviceFilter === svc
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {svc === 'Isenção IR Moléstia Grave' ? 'Isenção IR' : svc}
            </button>
          ))}

          <span className="text-slate-500 text-[11px] ml-2 mr-1">Urgência:</span>
          {['Todos', 'P1-Crítica', 'P2-Alta', 'P3-Moderada', 'P4-Estratégica'].map((urg) => (
            <button
              key={urg}
              onClick={() => setUrgencyFilter(urg)}
              className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer ${
                urgencyFilter === urg
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {urg.split('-')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List (Card-based, Clean and Readable) */}
      <div className="space-y-3">
        {filteredLeads.map((lead) => {
          const urgencyColor = {
            'P1-Crítica': 'bg-red-50 text-red-700 border-red-200',
            'P2-Alta': 'bg-amber-50 text-amber-700 border-amber-200',
            'P3-Moderada': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'P4-Estratégica': 'bg-blue-50 text-blue-700 border-blue-200',
          }[lead.urgencia];

          return (
            <div
              key={lead.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Patient info */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{lead.paciente}</span>
                    <span className="text-xs text-slate-500">({lead.idade} anos)</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgencyColor}`}>
                      {lead.urgencia}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {lead.diagnosticoCid} • <span className="text-slate-500">{lead.regime}</span>
                  </p>

                  <p className="text-xs text-slate-500">
                    Indicado por: <strong className="text-slate-700 font-semibold">{lead.medicoIndicador}</strong> ({lead.clinica})
                  </p>
                </div>

                {/* Right: Service, Value & Actions */}
                <div className="flex flex-wrap items-center gap-3 md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-500 block">Serviço:</span>
                    <span className="text-xs font-semibold text-teal-700">{lead.servico}</span>
                    <div className="text-xs font-bold text-slate-900">
                      R$ {lead.honorariosEstimados.toLocaleString('pt-BR')}
                    </div>
                  </div>

                  {/* Funnel Selector */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Triagem Inicial">Triagem Inicial</option>
                    <option value="Laudo em Análise">Laudo em Análise</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Contrato Fechado">Contrato Fechado</option>
                    <option value="Protocolado">Protocolado</option>
                    <option value="Concluído">Concluído</option>
                  </select>

                  {/* WhatsApp Action Button */}
                  <button
                    onClick={() => openWhatsApp(lead)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                    title="Chamar no WhatsApp com mensagem pronta"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Detalhes</span>
                  </button>
                </div>
              </div>

              {/* Bottom strip: Follow-up warning & quick note */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Próximo contato agendado para: <strong>{lead.proximoFollowUp}</strong></span>
                </span>
                <span className="hidden sm:inline text-slate-400 italic truncate max-w-md">
                  {lead.observacoes}
                </span>
              </div>
            </div>
          );
        })}

        {filteredLeads.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
            Nenhum paciente encontrado para esta busca ou filtro.
          </div>
        )}
      </div>

      {/* Modal: Novo Lead Rápido */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Paciente / Lead</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nome do Paciente *</label>
                <input
                  type="text"
                  required
                  value={newLead.paciente}
                  onChange={(e) => setNewLead({ ...newLead, paciente: e.target.value })}
                  placeholder="Ex: Roberto Carlos Pereira"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Idade</label>
                  <input
                    type="number"
                    value={newLead.idade}
                    onChange={(e) => setNewLead({ ...newLead, idade: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Telefone WhatsApp</label>
                  <input
                    type="text"
                    value={newLead.telefone}
                    onChange={(e) => setNewLead({ ...newLead, telefone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Serviço Alvo</label>
                  <select
                    value={newLead.servico}
                    onChange={(e) => setNewLead({ ...newLead, servico: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Isenção IR Moléstia Grave">Isenção IR Moléstia Grave</option>
                    <option value="Auxílio-Acidente">Auxílio-Acidente</option>
                    <option value="BPC/LOAS">BPC/LOAS</option>
                    <option value="Planejamento Previdenciário">Planejamento Previdenciário</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Grau de Urgência</label>
                  <select
                    value={newLead.urgencia}
                    onChange={(e) => setNewLead({ ...newLead, urgencia: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="P1-Crítica">P1-Crítica (Câncer / Diálise / Terminal)</option>
                    <option value="P2-Alta">P2-Alta (Sequela de Fratura / Infarto)</option>
                    <option value="P3-Moderada">P3-Moderada (BPC Idoso / Doença Crônica)</option>
                    <option value="P4-Estratégica">P4-Estratégica (Médico Planejamento)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diagnóstico / CID Informado</label>
                <input
                  type="text"
                  value={newLead.diagnosticoCid}
                  onChange={(e) => setNewLead({ ...newLead, diagnosticoCid: e.target.value })}
                  placeholder="Ex: C61 - Neoplasia Maligna de Próstata"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Médico Indicador</label>
                  <input
                    type="text"
                    value={newLead.medicoIndicador}
                    onChange={(e) => setNewLead({ ...newLead, medicoIndicador: e.target.value })}
                    placeholder="Ex: Dr. Carlos Menezes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clínica / Hospital</label>
                  <input
                    type="text"
                    value={newLead.clinica}
                    onChange={(e) => setNewLead({ ...newLead, clinica: e.target.value })}
                    placeholder="Ex: OncoVida Jardins"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Observações do Caso</label>
                <textarea
                  rows={2}
                  value={newLead.observacoes}
                  onChange={(e) => setNewLead({ ...newLead, observacoes: e.target.value })}
                  placeholder="Notas rápidas sobre a situação do paciente..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Lead */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedLead.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedLead.paciente}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Diagnóstico / CID:</span>
                  <strong className="text-slate-900">{selectedLead.diagnosticoCid}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Regime:</span>
                  <strong className="text-slate-900">{selectedLead.regime}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Médico Indicador:</span>
                  <strong className="text-slate-900">{selectedLead.medicoIndicador}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Clínica:</span>
                  <strong className="text-slate-900">{selectedLead.clinica}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Anotações do Representante:</span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedLead.observacoes}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => openWhatsApp(selectedLead)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar WhatsApp para Paciente</span>
              </button>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
