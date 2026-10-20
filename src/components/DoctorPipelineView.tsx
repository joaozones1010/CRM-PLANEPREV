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
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  ShieldCheck,
  Calendar,
  Loader2
} from 'lucide-react';
import { DoctorProspect, saveStoredProspects } from '../data/b2bProspectingData';
import { 
  getDoctorsList, 
  createDoctorRecord, 
  updateDoctorRecord, 
  deleteDoctorRecord 
} from '../lib/doctorService';

export const DoctorPipelineView: React.FC = () => {
  const [prospects, setProspects] = useState<DoctorProspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [specialtyFilter, setSpecialtyFilter] = useState('Todas');
  
  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DoctorProspect | null>(null);
  const [savingLoading, setSavingLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Form State
  const initialForm: Partial<DoctorProspect> = {
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
    observacoes: '',
    dataUltimaVisita: '',
    proximaVisita: ''
  };

  const [formData, setFormData] = useState<Partial<DoctorProspect>>(initialForm);

  // Carrega médicos do Supabase no mount
  useEffect(() => {
    let mounted = true;
    async function fetchDoctors() {
      setLoading(true);
      try {
        const data = await getDoctorsList();
        if (mounted) {
          setProspects(data);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3500);
  };

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

  const handleStatusChange = async (id: string, newStatus: DoctorProspect['statusParceria']) => {
    const target = prospects.find(p => p.id === id);
    if (!target) return;

    const updatedDoc: DoctorProspect = { ...target, statusParceria: newStatus };
    const updated = prospects.map(p => p.id === id ? updatedDoc : p);
    setProspects(updated);
    saveStoredProspects(updated);

    await updateDoctorRecord(updatedDoc);
    showNotification(`Status de ${target.nome} atualizado para "${newStatus}".`);
  };

  const handleToggleTerm = async (id: string) => {
    const target = prospects.find(p => p.id === id);
    if (!target) return;

    const updatedDoc: DoctorProspect = { ...target, termoAssinado: !target.termoAssinado };
    const updated = prospects.map(p => p.id === id ? updatedDoc : p);
    setProspects(updated);
    saveStoredProspects(updated);

    await updateDoctorRecord(updatedDoc);
    showNotification(`Termo de parceria ${updatedDoc.termoAssinado ? 'assinado' : 'pendente'}.`);
  };

  const handleDelete = async (id: string) => {
    const target = prospects.find(p => p.id === id);
    const docName = target?.nome || 'o médico';

    if (confirm(`Deseja realmente excluir ${docName} da sua carteira no Supabase?`)) {
      const updated = prospects.filter(p => p.id !== id);
      setProspects(updated);
      saveStoredProspects(updated);
      if (viewingDoc?.id === id) {
        setViewingDoc(null);
      }

      await deleteDoctorRecord(id);
      showNotification(`${docName} removido da carteira com sucesso.`);
    }
  };

  const handleOpenEdit = (doc: DoctorProspect) => {
    setEditingId(doc.id);
    setFormData(doc);
    setViewingDoc(null);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleClearAll = async () => {
    if (confirm('Atenção: deseja limpar toda a sua carteira?')) {
      for (const p of prospects) {
        await deleteDoctorRecord(p.id);
      }
      setProspects([]);
      saveStoredProspects([]);
      showNotification('Carteira limpa com sucesso.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.clinica) {
      alert('Preencha pelo menos o Nome do Médico e a Clínica.');
      return;
    }

    setSavingLoading(true);

    try {
      if (editingId) {
        // Atualização
        const updatedDoc: DoctorProspect = {
          ...(formData as DoctorProspect),
          id: editingId,
        };

        const updated = prospects.map(p => p.id === editingId ? updatedDoc : p);
        setProspects(updated);
        saveStoredProspects(updated);

        await updateDoctorRecord(updatedDoc);
        showNotification(`${updatedDoc.nome} atualizado com sucesso no Supabase!`);
      } else {
        // Cadastro Novo
        const newDoc: DoctorProspect = {
          id: `MED-${Date.now()}`,
          nome: formData.nome || '',
          crm: formData.crm || '',
          especialidade: formData.especialidade || 'Oncologia Clínica',
          clinica: formData.clinica || '',
          endereco: formData.endereco || '',
          cidadeBairro: formData.cidadeBairro || '',
          secretaria: formData.secretaria || '',
          telefoneSecretaria: formData.telefoneSecretaria || '',
          telefoneMedico: formData.telefoneMedico || '',
          melhorHorario: formData.melhorHorario || 'Manhã (antes do almoço)',
          statusParceria: formData.statusParceria || 'Mapeamento',
          dataUltimaVisita: formData.dataUltimaVisita || '',
          proximaVisita: formData.proximaVisita || '',
          materialEntregue: formData.materialEntregue || 'Nenhum ainda',
          termoAssinado: Boolean(formData.termoAssinado),
          potencialVolume: formData.potencialVolume || 'Alto',
          observacoes: formData.observacoes || ''
        };

        const updated = [newDoc, ...prospects];
        setProspects(updated);
        saveStoredProspects(updated);

        await createDoctorRecord(newDoc);
        showNotification(`${newDoc.nome} cadastrado com sucesso no Supabase!`);
      }

      setIsModalOpen(false);
      setEditingId(null);
    } catch (err: any) {
      alert('Erro ao salvar no Supabase: ' + (err?.message || 'Erro desconhecido'));
    } finally {
      setSavingLoading(false);
    }
  };

  const openSecretaryWhatsApp = (p: DoctorProspect) => {
    const text = encodeURIComponent(
      `Olá ${p.secretaria}, bom dia! Sou o consultor da PlanePrev de apoio técnico previdenciário e isenção aos pacientes do ${p.nome}. Gostaria de confirmar nossa visita técnica agendada para a clínica.`
    );
    window.open(`https://api.whatsapp.com/send?phone=55${p.telefoneSecretaria.replace(/\D/g, '')}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {actionFeedback && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>Carteira de Médicos &amp; Clínicas Parceiras</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestão direta no Supabase: visualize, edite, exclua e acompanhe cada médico e clínica prospectada.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleOpenNew}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Cadastrar Médico / Clínica</span>
            </button>

            {prospects.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                title="Limpar todos os médicos cadastrados"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 text-[11px] mr-1">Status:</span>
          {['Todos', 'Mapeamento', '1ª Visita Agendada', 'Visita Realizada', 'Proposta Enviada', 'Parceria Fechada', 'Em Manutenção'].map((st) => (
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
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por médico, clínica, secretária ou bairro..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
          <p className="text-xs">Carregando carteira de médicos do Supabase...</p>
        </div>
      )}

      {/* Prospect Cards Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => {
            return (
              <div 
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Doctor Title, Specialty & Action Icons */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{doc.nome}</h3>
                      <p className="text-xs text-slate-500">
                        {doc.crm ? `CRM ${doc.crm} • ` : ''}<span className="font-semibold text-slate-700">{doc.especialidade}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* Visualizar */}
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition cursor-pointer"
                        title="Visualizar detalhes completos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Editar médico / clínica"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Excluir */}
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Excluir do Supabase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ml-1 ${
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
                      <span>Secretária: <strong className="text-slate-900">{doc.secretaria || 'Não informada'}</strong></span>
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
                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100 line-clamp-2">
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

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => openSecretaryWhatsApp(doc)}
                      disabled={!doc.telefoneSecretaria}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40 border border-emerald-200 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State Banner (Clean & Inviting) */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
            <Building2 className="w-6 h-6" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">Sua Carteira de Clínicas está pronta para uso</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Você pode cadastrar médicos e clínicas mapeadas para começar suas visitas hoje. Cada médico cadastrado é sincronizado e salvo no banco de dados do Supabase.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Primeiro Médico / Clínica</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Visualizar Detalhes */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingDoc.nome}</h3>
                <p className="text-xs text-slate-500">
                  {viewingDoc.crm ? `CRM ${viewingDoc.crm} • ` : ''}{viewingDoc.especialidade}
                </p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-semibold text-slate-900">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span>{viewingDoc.clinica}</span>
                </div>
                {viewingDoc.endereco && (
                  <div className="flex items-center space-x-2 text-slate-600 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{viewingDoc.endereco} {viewingDoc.cidadeBairro ? `• ${viewingDoc.cidadeBairro}` : ''}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Secretária</span>
                  <span className="font-bold text-slate-800">{viewingDoc.secretaria || 'Não informada'}</span>
                  <span className="block text-slate-500 font-mono text-[11px] mt-0.5">{viewingDoc.telefoneSecretaria || 'Sem telefone'}</span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Telefone Médico</span>
                  <span className="font-bold text-slate-800">{viewingDoc.telefoneMedico || 'Não informado'}</span>
                  <span className="block text-slate-500 text-[11px] mt-0.5">Contato direto</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Melhor Horário</span>
                  <span className="font-semibold text-amber-700 flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{viewingDoc.melhorHorario}</span>
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Status da Parceria</span>
                  <span className="font-semibold text-teal-700 block mt-0.5">{viewingDoc.statusParceria}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Material Entregue</span>
                <span className="text-slate-800 font-medium">{viewingDoc.materialEntregue}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white">
                <span className="font-medium text-slate-700">Termo de Cooperação Técnica:</span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  viewingDoc.termoAssinado ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {viewingDoc.termoAssinado ? '✓ Assinado' : 'Pendente'}
                </span>
              </div>

              {viewingDoc.observacoes && (
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Observações Estratégicas</span>
                  <p className="text-slate-700 italic">{viewingDoc.observacoes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleDelete(viewingDoc.id)}
                className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Médico</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(viewingDoc)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
                >
                  Editar Dados
                </button>
                <button
                  onClick={() => openSecretaryWhatsApp(viewingDoc)}
                  disabled={!viewingDoc.telefoneSecretaria}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
                >
                  WhatsApp
                </button>
              </div>
            </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome do Médico *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Roberto Alencar"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">CRM (com Estado)</label>
                  <input
                    type="text"
                    placeholder="Ex: 145.890-SP"
                    value={formData.crm}
                    onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Especialidade Médica</label>
                  <select
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white cursor-pointer"
                  >
                    <option value="Oncologia Clínica">Oncologia Clínica</option>
                    <option value="Nefrologia">Nefrologia (Hemodiálise)</option>
                    <option value="Ortopedia & Traumatologia">Ortopedia & Traumatologia</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Neurologia">Neurologia (Parkinson / AVC)</option>
                    <option value="Pneumologia">Pneumologia</option>
                    <option value="Reumatologia">Reumatologia</option>
                    <option value="Cirurgia Geral">Cirurgia Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome da Clínica / Consultório *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Instituto OncoCentro"
                    value={formData.clinica}
                    onChange={(e) => setFormData({ ...formData, clinica: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Av. Paulista, 1000 - Cj 52"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cidade / Bairro</label>
                  <input
                    type="text"
                    placeholder="Ex: Bela Vista / São Paulo"
                    value={formData.cidadeBairro}
                    onChange={(e) => setFormData({ ...formData, cidadeBairro: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Melhor Horário de Visita</label>
                  <input
                    type="text"
                    placeholder="Ex: Terças e quintas antes das 12h"
                    value={formData.melhorHorario}
                    onChange={(e) => setFormData({ ...formData, melhorHorario: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome da Secretária / Recepcionista</label>
                  <input
                    type="text"
                    placeholder="Ex: Vanessa"
                    value={formData.secretaria}
                    onChange={(e) => setFormData({ ...formData, secretaria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp Secretária</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 98765-4321"
                    value={formData.telefoneSecretaria}
                    onChange={(e) => setFormData({ ...formData, telefoneSecretaria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp / Celular do Médico</label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 99123-4567"
                    value={formData.telefoneMedico}
                    onChange={(e) => setFormData({ ...formData, telefoneMedico: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status da Parceria</label>
                  <select
                    value={formData.statusParceria}
                    onChange={(e) => setFormData({ ...formData, statusParceria: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white cursor-pointer"
                  >
                    <option value="Mapeamento">Mapeamento</option>
                    <option value="1ª Visita Agendada">1ª Visita Agendada</option>
                    <option value="Visita Realizada">Visita Realizada</option>
                    <option value="Proposta Enviada">Proposta Enviada</option>
                    <option value="Parceria Fechada">Parceria Fechada</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Material Entregue na Clínica</label>
                <input
                  type="text"
                  placeholder="Ex: 50 Cartilhas + Display Acrílico + Modelo de Laudo"
                  value={formData.materialEntregue}
                  onChange={(e) => setFormData({ ...formData, materialEntregue: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="termoAssinado"
                  checked={formData.termoAssinado}
                  onChange={(e) => setFormData({ ...formData, termoAssinado: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="termoAssinado" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Termo de cooperação técnica assinado pela clínica / médico
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Observações Estratégicas</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Secretária muito receptiva, prefere visitas após o almoço..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingLoading}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  {savingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Salvar Alterações no Supabase' : 'Salvar Médico no Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
