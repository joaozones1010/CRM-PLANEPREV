import { supabase } from './supabase';
import { DoctorProspect, getStoredProspects, saveStoredProspects } from '../data/b2bProspectingData';

export const DOCTORS_TABLE = 'medicos_clinicas';

/**
 * Converte registro do Supabase para a tipagem do aplicativo DoctorProspect
 */
function mapFromSupabase(item: any): DoctorProspect {
  return {
    id: String(item.id),
    nome: item.nome || '',
    crm: item.crm || '',
    especialidade: item.especialidade || 'Oncologia Clínica',
    clinica: item.clinica || '',
    endereco: item.endereco || '',
    cidadeBairro: item.cidade_bairro || item.cidadeBairro || '',
    secretaria: item.secretaria || '',
    telefoneSecretaria: item.telefone_secretaria || item.telefoneSecretaria || '',
    telefoneMedico: item.telefone_medico || item.telefoneMedico || '',
    melhorHorario: item.melhor_horario || item.melhorHorario || 'Manhã (antes do almoço)',
    statusParceria: item.status_parceria || item.statusParceria || 'Mapeamento',
    dataUltimaVisita: item.data_ultima_visita || item.dataUltimaVisita || '',
    proximaVisita: item.proxima_visita || item.proximaVisita || '',
    materialEntregue: item.material_entregue || item.materialEntregue || 'Nenhum ainda',
    termoAssinado: Boolean(item.termo_assinado ?? item.termoAssinado),
    potencialVolume: item.potencial_volume || item.potencialVolume || 'Alto',
    observacoes: item.observacoes || '',
  };
}

/**
 * Prepara o objeto DoctorProspect para salvar no Supabase
 */
function mapToSupabase(doc: DoctorProspect) {
  return {
    id: doc.id,
    nome: doc.nome,
    crm: doc.crm,
    especialidade: doc.especialidade,
    clinica: doc.clinica,
    endereco: doc.endereco,
    cidade_bairro: doc.cidadeBairro,
    secretaria: doc.secretaria,
    telefone_secretaria: doc.telefoneSecretaria,
    telefone_medico: doc.telefoneMedico,
    melhor_horario: doc.melhorHorario,
    status_parceria: doc.statusParceria,
    data_ultima_visita: doc.dataUltimaVisita || null,
    proxima_visita: doc.proximaVisita || null,
    material_entregue: doc.materialEntregue,
    termo_assinado: Boolean(doc.termoAssinado),
    potencial_volume: doc.potencialVolume,
    observacoes: doc.observacoes,
  };
}

/**
 * Carrega lista de médicos/clínicas diretamente do Supabase.
 * Mantém o cache sincronizado em localStorage para redundância.
 */
export async function getDoctorsList(): Promise<DoctorProspect[]> {
  try {
    const { data, error } = await supabase
      .from(DOCTORS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Aviso ao consultar Supabase (usando dados locais):', error.message);
      return getStoredProspects();
    }

    if (data && Array.isArray(data)) {
      const mapped = data.map(mapFromSupabase);
      saveStoredProspects(mapped);
      return mapped;
    }

    return getStoredProspects();
  } catch (err) {
    console.warn('Erro na chamada Supabase getDoctorsList:', err);
    return getStoredProspects();
  }
}

/**
 * Cadastra um novo médico/clínica no Supabase
 */
export async function createDoctorRecord(doc: DoctorProspect): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = mapToSupabase(doc);
    const { error } = await supabase.from(DOCTORS_TABLE).insert([payload]);

    if (error) {
      console.warn('Erro ao inserir no Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Falha na requisição insert Supabase:', err);
    return { success: false, error: err?.message || 'Falha de comunicação com o Supabase' };
  }
}

/**
 * Atualiza um registro existente de médico/clínica no Supabase
 */
export async function updateDoctorRecord(doc: DoctorProspect): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = mapToSupabase(doc);
    const { error } = await supabase
      .from(DOCTORS_TABLE)
      .update(payload)
      .eq('id', doc.id);

    if (error) {
      console.warn('Erro ao atualizar no Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Falha na requisição update Supabase:', err);
    return { success: false, error: err?.message || 'Falha de comunicação com o Supabase' };
  }
}

/**
 * Exclui um registro de médico/clínica no Supabase
 */
export async function deleteDoctorRecord(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(DOCTORS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Erro ao deletar no Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Falha na requisição delete Supabase:', err);
    return { success: false, error: err?.message || 'Falha de comunicação com o Supabase' };
  }
}
