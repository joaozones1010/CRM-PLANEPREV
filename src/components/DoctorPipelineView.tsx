import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Stethoscope, 
  X, 
  Trash2, 
  Edit3, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { 
  DoctorProspect, 
  getStoredProspects, 
  saveStoredProspects, 
  sampleDemonstrationDoctors 
} from '../data/b2bProspectingData';

export const DoctorPipelineView: React.FC = () => {
  const [prospects, setProspects] = useState<DoctorProspect[]>(() => getStoredProspects());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredProspects(prospects);
  }, [prospects]);

  // Form State
  const [formData, setFormData] = useState<Partial<DoctorProspect>>({
    nome: '',
    crm: '',
    especialidade: 'Oncologia Clínica',
    clinica: '',
    endereco: '',
    cidadeBairro: '',
    secretaria: '',
    telefoneSecretaria: '',
    telefoneMedico: '',
    melhorHorario: 'Manhã (antes do almoço)',
    statusParceria: 'Mapeamento',
    materialEntregue: 'Nenhum ainda',
    termoAssinado: false,
    potencialVolume: 'Alto',
    observacoes: ''
  });

  const filtered = useMemo(() => {
    return prospects.filter(p => {
      const matchSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.clinica.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.secretaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.cidadeBairro.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'Todos' || p.statusParceria === statusFilter;
      const matchSpec = specialtyFilter === 'Todas' || p.especialidade.includes(specialtyFilter);
      return matchSearch && matchStatus && matchSpec;
    });
  }, [prospects, searchTerm, statusFilter, specialtyFilter]);

  const handleStatusChange = (id: string, newStatus: DoctorProspect['statusParceria']) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, statusParceria: newStatus } : p));
  };

  const handleToggleTerm = (id: string) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, termoAssinado: !p.termoAssinado } : p));
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir este médico da sua carteira?')) {
      setProspects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleOpenEdit = (doc: DoctorProspect) => {
    setEditingId(doc.id);
    setFormData(doc);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      crm: '',
      especialidade: 'Oncologia Clínica',
      clinica: '',
      endereco: '',
      cidadeBairro: '',
      secretaria: '',
      telefoneSecretaria: '',
      telefoneMedico: '',
      melhorHorario: 'Manhã (antes do almoço)',
      statusParceria: 'Mapeamento',
      materialEntregue: 'Nenhum ainda',
      termoAssinado: false,
      potencialVolume: 'Alto',
      observacoes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.clinica) return;

    if (editingId) {
      // Edit existing
      setProspects(prev => prev.map(p => p.id === editingId ? { ...(p as any), ...formData } : p));
    } else {
      // Create new
      const created: DoctorProspect = {
        id: `MED-${String(prospects.length + 1).padStart(3, '0')}`,
        nome: formData.nome || '',
        crm: formData.crm || 'CRM a confirmar',
        especialidade: formData.especialidade || 'Clínica Geral',
        clinica: formData.clinica || '',
        endereco: formData.endereco || '',
        cidadeBairro: formData.cidadeBairro || 'São Paulo',
        secretaria: formData.secretaria || 'Secretária',
        telefoneSecretaria: formData.telefoneSecretaria || '',
        telefoneMedico: formData.telefoneMedico || '',
        melhorHorario: formData.melhorHorario || 'A combinar',
        statusParceria: (formData.statusParceria as any) || 'Mapeamento',
        dataUltimaVisita: '-',
        proximaVisita: new Date().toISOString().split('T')[0],
        materialEntregue: formData.materialEntregue || 'Nenhum ainda',
        termoAssinado: !!formData.termoAssinado,
        potencialVolume: (formData.potencialVolume as any) || 'Alto',
        observacoes: formData.observacoes || 'Cadastrado para prospecção.'
      };
      setProspects([created, ...prospects]);
    }

    setIsModalOpen(false);
  };

  const handleLoadSamples = () => {
    setProspects(sampleDemonstrationDoctors);
  };

  const handleClearAll = () => {
    if (confirm('Deseja limpar todos os médicos da carteira e começar 100% em branco?')) {
      setProspects([]);
    }
  };

  const openSecretaryWhatsApp = (p: DoctorProspect) => {
    const text = encodeURIComponent(
      `Olá ${p.secretaria}, bom dia! Sou o representante da PlanePrev. Gostaria de agendar 5 minutinhos no melhor horário do ${p.nome} para apresentar nosso modelo de parceria institucional com a ${p.clinica}. Muito obrigado!`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${p.telefoneSecretaria.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar médico, clínica, secretária..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleOpenNew}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cadastrar Médico / Clínica</span>
            </button>

            {prospects.length > 0 ? (
              <button
                onClick={handleClearAll}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                title="Limpar todos os médicos cadastrados"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleLoadSamples}
                className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                title="Carregar 2 exemplos de demonstração"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Exemplos</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 text-[11px] mr-1">Status:</span>
          {['Todos', 'Mapeamento', '1ª Visita Agendada', 'Visita Realizada', 'Proposta Enviada', 'Parceria Fechada'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="text-slate-500 text-[11px] ml-2 mr-1">Especialidade:</span>
          {['Todas', 'Oncologia', 'Ortopedia', 'Nefrologia', 'Cardiologia'].map((spec) => (
            <button
              key={spec}
              onClick={() => setSpecialtyFilter(spec)}
              className={`px-2 py-1 rounded-md text-[11px] transition cursor-pointer ${
                specialtyFilter === spec
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Prospects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => {
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Doctor Title & Specialty */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{doc.nome}</h3>
                    <p className="text-xs text-slate-500">
                      CRM {doc.crm} • <span className="font-semibold text-slate-700">{doc.especialidade}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(doc)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                      title="Editar dados"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                      title="Excluir da carteira"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      doc.statusParceria === 'Parceria Fechada'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : doc.statusParceria === '1ª Visita Agendada'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {doc.statusParceria}
                    </span>
                  </div>
                </div>

                {/* Clinic & Location */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="font-bold text-slate-900">{doc.clinica}</span>
                  </div>
                  {doc.endereco && (
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.endereco} {doc.cidadeBairro ? `- ${doc.cidadeBairro}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                    <span>Secretária: <strong className="text-slate-900">{doc.secretaria}</strong></span>
                    <span className="font-mono text-[11px]">{doc.telefoneSecretaria || 'Sem telefone'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-700 text-[11px]">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>Melhor Horário: <strong>{doc.melhorHorario}</strong></span>
                  </div>
                </div>

                {/* Partnership Status & Materials */}
                <div className="text-xs space-y-1 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Termo de Parceria Assinado:</span>
                    <button
                      onClick={() => handleToggleTerm(doc.id)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                        doc.termoAssinado 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {doc.termoAssinado ? '✓ Termo Assinado' : 'Pendente de Assinatura'}
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <span>Material na Clínica: </span>
                    <strong className="text-slate-700">{doc.materialEntregue}</strong>
                  </div>
                </div>

                {doc.observacoes && (
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                    "{doc.observacoes}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State Banner (Clean & Inviting) */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
            <Building2 className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">Sua Carteira de Clínicas está pronta para uso</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Você pode cadastrar médicos e clínicas mapeadas para começar suas visitas hoje. Todos os seus dados ficam salvos automaticamente no seu navegador.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Meu Primeiro Médico / Clínica</span>
            </button>

            <button
              onClick={handleLoadSamples}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Carregar 2 Exemplos de Demonstração
            </button>
          </div>
        </div>
      )}

      {/* Modal: Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Editar Médico / Clínica' : 'Cadastrar Médico / Clínica para Prospecção'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nome do Médico *</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Dr. Roberto Alencar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">CRM (com UF)</label>
                  <input
                    type="text"
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    placeholder="Ex: 145.220-SP"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Especialidade Médica</label>
                  <select
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Oncologia Clínica">Oncologia Clínica</option>
                    <option value="Ortopedia e Traumatologia">Ortopedia e Traumatologia</option>
                    <option value="Nefrologia">Nefrologia (Diálise)</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Cirurgia Geral">Cirurgia Geral</option>
                    <option value="Neurologia">Neurologia</option>
                    <option value="Administrador de Clínica">Administrador de Clínica</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status da Parceria</label>
                  <select
                    value={formData.statusParceria}
                    onChange={(e) => setFormData({ ...formData, statusParceria: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Mapeamento">Mapeamento Inicial</option>
                    <option value="1ª Visita Agendada">1ª Visita Agendada</option>
                    <option value="Visita Realizada">Visita Realizada</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Parceria Fechada">Parceria Fechada</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Clínica / Hospital *</label>
                  <input
                    type="text"
                    required
                    value={formData.clinica}
                    onChange={(e) => setFormData({ ...formData, clinica: e.target.value })}
                    placeholder="Ex: Clínica OncoVida"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bairro / Região</label>
                  <input
                    type="text"
                    value={formData.cidadeBairro}
                    onChange={(e) => setFormData({ ...formData, cidadeBairro: e.target.value })}
                    placeholder="Ex: Jardins / São Paulo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Endereço Completo & Sala</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Ex: Av. Paulista, 1000 - Cj 52"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Nome da Secretária</label>
                  <input
                    type="text"
                    value={formData.secretaria}
                    onChange={(e) => setFormData({ ...formData, secretaria: e.target.value })}
                    placeholder="Ex: Fernanda"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">WhatsApp Secretária</label>
                  <input
                    type="text"
                    value={formData.telefoneSecretaria}
                    onChange={(e) => setFormData({ ...formData, telefoneSecretaria: e.target.value })}
                    placeholder="(11) 98888-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Melhor Horário de Visita</label>
                  <input
                    type="text"
                    value={formData.melhorHorario}
                    onChange={(e) => setFormData({ ...formData, melhorHorario: e.target.value })}
                    placeholder="Ex: Quintas, 11h45"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Material Deixado</label>
                  <input
                    type="text"
                    value={formData.materialEntregue}
                    onChange={(e) => setFormData({ ...formData, materialEntregue: e.target.value })}
                    placeholder="Ex: Display + 30 Cartilhas"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Observações Estratégicas</label>
                <textarea
                  rows={2}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Ex: Reunião rápida marcada com secretária..."
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
                  {editingId ? 'Salvar Alterações' : 'Salvar Médico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
