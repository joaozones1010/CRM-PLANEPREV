export interface LeadItem {
  id: string;
  dataEntrada: string;
  paciente: string;
  idade: number;
  telefone: string;
  regime: 'Aposentado INSS' | 'Pensionista INSS' | 'Servidor RPPS' | 'CLT Ativo' | 'Sem Contribuição' | 'Médico/PJ';
  medicoIndicador: string;
  clinica: string;
  especialidade: string;
  servico: 'Isenção IR Moléstia Grave' | 'Planejamento Previdenciário' | 'Auxílio-Acidente' | 'BPC/LOAS';
  diagnosticoCid: string;
  urgencia: 'P1-Crítica' | 'P2-Alta' | 'P3-Moderada' | 'P4-Estratégica';
  status: 'Novo Lead' | 'Triagem Inicial' | 'Laudo em Análise' | 'Proposta Enviada' | 'Contrato Fechado' | 'Protocolado' | 'Concluído';
  honorariosEstimados: number;
  dataUltimoContato: string;
  proximoFollowUp: string;
  canal: 'WhatsApp' | 'Visita Presencial' | 'Ligação' | 'E-mail';
  checklistDocs: 'Pendente' | '50%' | '100%';
  observacoes: string;
}

export interface DoctorPartner {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  clinica: string;
  cidade: string;
  secretaria: string;
  telefoneSecretaria: string;
  horarioAbordagem: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  status: 'Parceiro Ativo' | 'Apresentação Concluída' | '1ª Visita Realizada' | 'Mapeamento' | 'Em Nutrição';
  materialEntregue: string;
  leadsGerados: number;
  contratosFechados: number;
  conversao: string;
}

export interface CidLawItem {
  cid: string;
  patologia: string;
  servico: string;
  enquadramentoLegal: string;
  urgencia: 'P1-Crítica' | 'P2-Alta' | 'P3-Moderada' | 'P4-Estratégica';
  documentosMandatorios: string;
  jurisprudencia: string;
}

export interface FollowUpRule {
  gatilho: string;
  momento: string;
  canal: string;
  destinatario: string;
  objetivo: string;
  templateScript: string;
}

export const mockLeads: LeadItem[] = [
  {
    id: "PLP-2026-001",
    dataEntrada: "2026-10-02",
    paciente: "Roberto Magalhães Guimarães",
    idade: 67,
    telefone: "(11) 98452-3310",
    regime: "Aposentado INSS",
    medicoIndicador: "Dr. Carlos Eduardo Menezes",
    clinica: "Instituto OncoVida Jardins",
    especialidade: "Oncologia",
    servico: "Isenção IR Moléstia Grave",
    diagnosticoCid: "C61 - Neoplasia Maligna de Próstata",
    urgencia: "P1-Crítica",
    status: "Laudo em Análise",
    honorariosEstimados: 14500,
    dataUltimoContato: "2026-10-05",
    proximoFollowUp: "2026-10-07",
    canal: "WhatsApp",
    checklistDocs: "50%",
    observacoes: "Aposentado desde 2019 com retenção de R$ 1.850/mês de IR na fonte. Restituição retroativa estimada em R$ 98.000."
  },
  {
    id: "PLP-2026-002",
    dataEntrada: "2026-10-03",
    paciente: "Mariana Alencar Santos",
    idade: 38,
    telefone: "(11) 99124-7744",
    regime: "CLT Ativo",
    medicoIndicador: "Dra. Patrícia Silveira",
    clinica: "Centro Ortopédico Paulista",
    especialidade: "Ortopedia",
    servico: "Auxílio-Acidente",
    diagnosticoCid: "S82.2 - Fratura do Platô Tibial c/ Sequela",
    urgencia: "P2-Alta",
    status: "Proposta Enviada",
    honorariosEstimados: 9800,
    dataUltimoContato: "2026-10-05",
    proximoFollowUp: "2026-10-06",
    canal: "Ligação",
    checklistDocs: "100%",
    observacoes: "Acidente de moto em 2024. Teve alta do INSS e retornou à função com redução de amplitude articular. Benefício cumulativo com salário."
  },
  {
    id: "PLP-2026-003",
    dataEntrada: "2026-09-28",
    paciente: "Dra. Helena Vasconcellos (Médica)",
    idade: 52,
    telefone: "(11) 97321-9908",
    regime: "Médico/PJ",
    medicoIndicador: "Indicação Própria / Parceira",
    clinica: "Hospital Samaritano",
    especialidade: "Cardiologia",
    servico: "Planejamento Previdenciário",
    diagnosticoCid: "Planejamento Especial / EC 103",
    urgencia: "P4-Estratégica",
    status: "Contrato Fechado",
    honorariosEstimados: 8500,
    dataUltimoContato: "2026-10-04",
    proximoFollowUp: "2026-10-12",
    canal: "Visita Presencial",
    checklistDocs: "100%",
    observacoes: "Médica intensivista com 2 vínculos CLT e 1 PJ. Ajuste de recolhimento acima do teto para restituição e regra de transição especial."
  },
  {
    id: "PLP-2026-004",
    dataEntrada: "2026-10-04",
    paciente: "Sebastião Ferreira da Cruz",
    idade: 71,
    telefone: "(11) 96541-1189",
    regime: "Sem Contribuição",
    medicoIndicador: "Dr. André Villas Bôas",
    clinica: "Clínica NefroRim Moema",
    especialidade: "Nefrologia",
    servico: "BPC/LOAS",
    diagnosticoCid: "N18.5 - Doença Renal Crônica Estágio 5",
    urgencia: "P1-Crítica",
    status: "Novo Lead",
    honorariosEstimados: 4500,
    dataUltimoContato: "2026-10-04",
    proximoFollowUp: "2026-10-06",
    canal: "WhatsApp",
    checklistDocs: "Pendente",
    observacoes: "Faz hemodiálise 3x por semana. Renda familiar per capita inferior a 1/4 do salário mínimo. Necessita auxílio urgente para medicamentos."
  },
  {
    id: "PLP-2026-005",
    dataEntrada: "2026-10-01",
    paciente: "Geraldo Prado Nogueira",
    idade: 64,
    telefone: "(11) 98112-4455",
    regime: "Servidor RPPS",
    medicoIndicador: "Dr. Carlos Eduardo Menezes",
    clinica: "Instituto OncoVida Jardins",
    especialidade: "Oncologia",
    servico: "Isenção IR Moléstia Grave",
    diagnosticoCid: "C50 - Neoplasia Maligna de Mama Masculina",
    urgencia: "P1-Crítica",
    status: "Protocolado",
    honorariosEstimados: 16800,
    dataUltimoContato: "2026-10-03",
    proximoFollowUp: "2026-10-10",
    canal: "WhatsApp",
    checklistDocs: "100%",
    observacoes: "Protocolado pedido administrativo na fonte pagadora (SPPrev) com pedido retroativo dos últimos 5 anos de desconto de IR."
  },
  {
    id: "PLP-2026-006",
    dataEntrada: "2026-10-04",
    paciente: "Rodrigo Toledo Barbosa",
    idade: 42,
    telefone: "(11) 99876-0021",
    regime: "CLT Ativo",
    medicoIndicador: "Dra. Patrícia Silveira",
    clinica: "Centro Ortopédico Paulista",
    especialidade: "Ortopedia",
    servico: "Auxílio-Acidente",
    diagnosticoCid: "S68.1 - Amputação Traumática Parcial Falange",
    urgencia: "P2-Alta",
    status: "Triagem Inicial",
    honorariosEstimados: 7800,
    dataUltimoContato: "2026-10-05",
    proximoFollowUp: "2026-10-06",
    canal: "Ligação",
    checklistDocs: "50%",
    observacoes: "Operador de máquinas. Perda de falange distal do 3º dedo da mão direita. CAT emitida na época. Redução de preensão comprovada."
  }
];

export const mockDoctors: DoctorPartner[] = [
  {
    id: "MED-001",
    nome: "Dr. Carlos Eduardo Menezes",
    crm: "148.920-SP",
    especialidade: "Oncologia Clínica",
    clinica: "Instituto OncoVida Jardins",
    cidade: "São Paulo / SP",
    secretaria: "Fernanda Ribeiro",
    telefoneSecretaria: "(11) 3288-4100",
    horarioAbordagem: "Quintas, 11h45 às 12h15 (intervalo da manhã)",
    tier: "Tier 1",
    status: "Parceiro Ativo",
    materialEntregue: "Display de Recepção + 50 Cartilhas 'Direitos do Paciente Oncológico'",
    leadsGerados: 14,
    contratosFechados: 9,
    conversao: "64.3%"
  },
  {
    id: "MED-002",
    nome: "Dr. André Villas Bôas",
    crm: "162.330-SP",
    especialidade: "Nefrologia",
    clinica: "Clínica NefroRim Moema",
    cidade: "São Paulo / SP",
    secretaria: "Juliana Camargo",
    telefoneSecretaria: "(11) 3450-8890",
    horarioAbordagem: "Terças, 08h30 (antes de iniciar hemodiálise)",
    tier: "Tier 1",
    status: "Parceiro Ativo",
    materialEntregue: "Folder Informativo Isenção IR & BPC + Modelo de Laudo com CID",
    leadsGerados: 11,
    contratosFechados: 7,
    conversao: "63.6%"
  },
  {
    id: "MED-003",
    nome: "Dra. Patrícia Silveira",
    crm: "175.404-SP",
    especialidade: "Ortopedia e Traumatologia",
    clinica: "Centro Ortopédico Paulista",
    cidade: "São Paulo / SP",
    secretaria: "Renata Duarte",
    telefoneSecretaria: "(11) 3819-2200",
    horarioAbordagem: "Segundas, 17h00 (final de ambulatório)",
    tier: "Tier 1",
    status: "Parceiro Ativo",
    materialEntregue: "Guia de Auxílio-Acidente para Pacientes com Sequelas Articulares",
    leadsGerados: 18,
    contratosFechados: 10,
    conversao: "55.5%"
  },
  {
    id: "MED-004",
    nome: "Dr. Marcelo Fagundes",
    crm: "139.771-SP",
    especialidade: "Cardiologia",
    clinica: "CardioCenter Paulista",
    cidade: "São Paulo / SP",
    secretaria: "Aline Moreira",
    telefoneSecretaria: "(11) 3055-6677",
    horarioAbordagem: "Quartas, 13h30",
    tier: "Tier 2",
    status: "Apresentação Concluída",
    materialEntregue: "Apresentação Institucional PlanePrev + Parecer Cardiopatia Grave",
    leadsGerados: 5,
    contratosFechados: 2,
    conversao: "40.0%"
  },
  {
    id: "MED-005",
    nome: "Dr. Roberto Spinelli",
    crm: "122.501-SP",
    especialidade: "Cirurgia Geral & Aparelho Digestivo",
    clinica: "Clínica Gastrosul",
    cidade: "São Paulo / SP",
    secretaria: "Cláudia Valente",
    telefoneSecretaria: "(11) 2199-3000",
    horarioAbordagem: "Sextas, 10h00",
    tier: "Tier 2",
    status: "1ª Visita Realizada",
    materialEntregue: "Proposta de Planejamento Previdenciário Médico para o Corpo Clínico",
    leadsGerados: 2,
    contratosFechados: 1,
    conversao: "50.0%"
  }
];

export const mockCidLaws: CidLawItem[] = [
  {
    cid: "C00 - C97",
    patologia: "Neoplasia Maligna (Qualquer tipo de Câncer)",
    servico: "Isenção de IRPF + Restituição 5 anos / BPC",
    enquadramentoLegal: "Lei 7.713/88, Art. 6º, XIV; Súmula 598/STJ",
    urgencia: "P1-Crítica",
    documentosMandatorios: "Laudo Anatomopatológico, biópsia conclusiva, relatório médico com data do diagnóstico.",
    jurisprudencia: "Súmula 598 STJ: É desnecessária a apresentação de laudo médico oficial para o reconhecimento de isenção de IRPF se o magistrado entender suficientemente demonstrada a doença por outros meios de prova."
  },
  {
    cid: "N18.0 - N18.9",
    patologia: "Nefropatia Grave (Insuficiência Renal Crônica)",
    servico: "Isenção de IRPF / BPC / Aposentadoria Incapacidade",
    enquadramentoLegal: "Lei 7.713/88, Art. 6º, XIV",
    urgencia: "P1-Crítica",
    documentosMandatorios: "Exames de uréia, creatinina seriada, clearence de creatinina, relatório de fístula ou diálise.",
    jurisprudencia: "Tema 250 TNU: Pacientes renais graves em tratamento conservador ou hemodialítico têm direito à isenção desde a constatação médica da gravidade."
  },
  {
    cid: "I25 / I50",
    patologia: "Cardiopatia Grave (Infarto, Insuficiência Cardíaca, Pontes de Safena)",
    servico: "Isenção de IRPF / Planejamento Previdenciário",
    enquadramentoLegal: "Lei 7.713/88, Art. 6º, XIV",
    urgencia: "P1-Crítica",
    documentosMandatorios: "Ecocardiograma c/ fração de ejeção, cateterismo, cintilografia miocárdica, laudo cardiológico.",
    jurisprudencia: "Cardiopatia grave enseja isenção mesmo quando os sintomas encontram-se controlados por uso de medicamentos contínuos."
  },
  {
    cid: "S00 - T98",
    patologia: "Sequelas de Fraturas e Traumas Articulares (Ombro, Joelho, Mão, Coluna)",
    servico: "Auxílio-Acidente (Mensal até a Aposentadoria)",
    enquadramentoLegal: "Lei 8.213/91, Art. 86; Decreto 3.048/99",
    urgencia: "P2-Alta",
    documentosMandatorios: "Boletim de atendimento de urgência da época do acidente, exames de imagem da sequela consolidada, laudo com redução funcional.",
    jurisprudencia: "Tema 416 STJ: O auxílio-acidente é devido independentemente do grau de perda da capacidade laborativa, bastando haver nexo de causalidade e redução mínima permanente."
  },
  {
    cid: "G20",
    patologia: "Doença de Parkinson",
    servico: "Isenção de IRPF + BPC",
    enquadramentoLegal: "Lei 7.713/88, Art. 6º, XIV",
    urgencia: "P1-Crítica",
    documentosMandatorios: "Relatório neurológico detalhado com escala de Hoehn & Yahr, histórico de medicação antiparkinsoniana.",
    jurisprudencia: "Doença crônica degenerativa irreversível que gera direito automático à isenção a partir do diagnóstico documentado."
  },
  {
    cid: "M45",
    patologia: "Espondiloartrose Anquilosante / Espondilite",
    servico: "Isenção de IRPF / Auxílio por Incapacidade",
    enquadramentoLegal: "Lei 7.713/88, Art. 6º, XIV",
    urgencia: "P2-Alta",
    documentosMandatorios: "Radiografias e ressonâncias de coluna e sacroilíacas, laudo reumatológico com comprometimento da mobilidade.",
    jurisprudencia: "Reconhecimento pleno em sede administrativa e judicial para aposentados e pensionistas do INSS e RPPS."
  }
];

export const mockFollowUpRules: FollowUpRule[] = [
  {
    gatilho: "Recebimento do Lead da Clínica",
    momento: "D+0 (Nas primeiras 2 horas)",
    canal: "WhatsApp + Ligação",
    destinatario: "Paciente / Familiar",
    objetivo: "Boas-vindas acolhedoras, validação da indicação do Dr.(a) e coleta de histórico previdenciário.",
    templateScript: "Olá {{PACIENTE}}, quem fala é {{REPRESENTANTE}} da PlanePrev. O {{NOME_MEDICO}} nos compartilhou que você está em acompanhamento clínico. Nossa assessoria apoia pacientes do Dr. {{SOBRENOME_MEDICO}} para garantir direitos previdenciários e tributários garantidos por lei (como isenção de imposto de renda ou auxílios específicos). Teremos o maior prazer em analisar sua documentação gratuitamente. Podemos conversar por 5 minutos?"
  },
  {
    gatilho: "Triagem Documental Concluída",
    momento: "D+1",
    canal: "WhatsApp",
    destinatario: "Paciente / Familiar",
    objetivo: "Apresentar o diagnóstico de viabilidade técnica e valores estimados de benefício ou restituição.",
    templateScript: "Olá {{PACIENTE}}! Nossa equipe jurídica e pericial concluiu a triagem inicial dos seus laudos de {{DIAGNOSTICO}}. Identificamos viabilidade concreta para {{SERVICO}}, com potencial de gerar {{VALOR_ESTIMADO}} em seu favor. O próximo passo é formalizarmos a representação para protocolarmos o pedido. Posso enviar o termo de autorização agora?"
  },
  {
    gatilho: "Proposta Enviada s/ Resposta",
    momento: "D+3",
    canal: "Ligação Telefônica",
    destinatario: "Paciente",
    objetivo: "Sanar dúvidas sobre honorários no êxito, prazos do INSS/Receita e documentação complementar.",
    templateScript: "Olá {{PACIENTE}}, aqui é {{REPRESENTANTE}} da PlanePrev. Estou ligando para saber se você conseguiu ler a proposta que enviamos sobre o pedido de {{SERVICO}}. Como na PlanePrev nossos honorários são majoritariamente no êxito (você só paga quando o direito for reconhecido), gostaria de tirar qualquer dúvida para já darmos entrada nesta semana!"
  },
  {
    gatilho: "Protocolo Administrativo Realizado",
    momento: "D+7 a D+15",
    canal: "WhatsApp + E-mail",
    destinatario: "Paciente",
    objetivo: "Enviar comprovante de protocolo, número do processo e orientações para eventual perícia médica.",
    templateScript: "Notícia importante, {{PACIENTE}}! Seu processo de {{SERVICO}} foi devidamente protocolado sob o número de requerimento {{NUMERO_PROCESSO}}. Já anexamos todos os laudos do {{NOME_MEDICO}}. Estamos monitorando o sistema diariamente. Caso seja agendada perícia médica presencial, faremos uma sessão de orientação de 15 minutos com você antes!"
  },
  {
    gatilho: "Nutrição Mensal com a Clínica",
    momento: "D+30",
    canal: "Visita Presencial / WhatsApp",
    destinatario: "Médico & Secretária",
    objetivo: "Devolutiva ética dos casos encaminhados, reforço do relacionamento e entrega de novos materiais.",
    templateScript: "Olá {{SECRETARIA}}, bom dia! Passando para atualizar o Dr. {{NOME_MEDICO}}: dos pacientes que conversamos no último mês, já obtivemos deferimento na isenção de IRPF para o Sr. {{PACIENTE}}, o que trouxe grande alívio financeiro para o tratamento dele. Deixo aqui 30 novas cartilhas atualizadas para a recepção. Grande abraço!"
  }
];

export const googleAppsScriptTemplate = `/**
 * ============================================================================
 * PLANEPREV CRM - GOOGLE APPS SCRIPT AUTOMATION ENGINE
 * ============================================================================
 * Instruções de Instalação:
 * 1. No seu Google Sheets, clique em 'Extensões' > 'Apps Script'.
 * 2. Apague o código padrão e cole todo o conteúdo deste script.
 * 3. Configure as variáveis globais abaixo (E-mail do Representante e Webhook).
 * 4. Salve e clique em 'Acionadores' (ícone de relógio) > Adicionar Acionador:
 *    - Função: dailyFollowUpReminder
 *    - Evento: Baseado no tempo > Cronômetro diário (entre 08h e 09h).
 * ============================================================================
 */

const CONFIG = {
  REP_EMAIL: 'representante.externo@planeprev.com.br',
  WEBHOOK_URL_WHATSAPP: 'https://seu-servico-webhook.com/planeprev/notificacao',
  SHEET_PIPELINE: '01_Pipeline_Leads',
  SHEET_MEDICOS: '02_Medicos_e_Clinicas',
};

/**
 * Gatilho ao editar célula no Sheets (onEdit)
 * Automatiza preenchimento de datas e alertas de leads de urgência P1
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const sheetName = sheet.getName();

  // Verifica se a edição ocorreu na aba do Pipeline
  if (sheetName === CONFIG.SHEET_PIPELINE) {
    const row = range.getRow();
    const col = range.getColumn();

    // Se editou a coluna de Grau de Urgência (Coluna L = 12) e for P1-Crítica
    if (col === 12 && range.getValue() === 'P1-Crítica') {
      const nomePaciente = sheet.getRange(row, 3).getValue();
      const servico = sheet.getRange(row, 10).getValue();
      const cid = sheet.getRange(row, 11).getValue();

      sendUrgentLeadAlert(nomePaciente, servico, cid);
    }

    // Atualiza a coluna de Data do Último Contato (Coluna O = 15) automaticamente se mudou o Status
    if (col === 13) { // Status do Funil
      const hoje = Utilities.formatDate(new Date(), 'GMT-3', 'dd/MM/yyyy');
      sheet.getRange(row, 15).setValue(hoje);
    }
  }
}

/**
 * Envia alerta emergencial para lead P1-Crítica
 */
function sendUrgentLeadAlert(paciente, servico, cid) {
  const subject = '🚨 [URGÊNCIA CRÍTICA P1] Novo Lead Clínico Prioritário - PlanePrev';
  const body = 'Atenção Representante:\\n\\n' +
               'O paciente ' + paciente + ' foi cadastrado com urgência P1-Crítica.\\n' +
               'Serviço: ' + servico + '\\n' +
               'Diagnóstico/CID: ' + cid + '\\n\\n' +
               'SLA Máximo de Atendimento: 12 Horas.\\n' +
               'Acesse o CRM e inicie o protocolo imediato.';

  MailApp.sendEmail(CONFIG.REP_EMAIL, subject, body);
}

/**
 * Cron diário para verificar follow-ups vencidos ou para hoje
 */
function dailyFollowUpReminder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_PIPELINE);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const hoje = Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd');
  let pendencias = [];

  // Pula o cabeçalho (linha 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[12]; // Coluna 13: Status do Funil
    const proximoFollowUp = row[15]; // Coluna 16: Próximo FollowUp

    if (status !== 'Concluído' && status !== 'Perdido/Desqualificado' && proximoFollowUp) {
      let dataFormatada = '';
      if (proximoFollowUp instanceof Date) {
        dataFormatada = Utilities.formatDate(proximoFollowUp, 'GMT-3', 'yyyy-MM-dd');
      } else {
        dataFormatada = proximoFollowUp.toString();
      }

      if (dataFormatada <= hoje) {
        pendencias.push({
          id: row[0],
          paciente: row[2],
          telefone: row[4],
          servico: row[9],
          dataFollow: dataFormatada
        });
      }
    }
  }

  if (pendencias.length > 0) {
    let emailText = 'Relatório Diário de Follow-ups PlanePrev (' + pendencias.length + ' pendentes):\\n\\n';
    pendencias.forEach(p => {
      emailText += '• ' + p.paciente + ' (' + p.servico + ') - Tel: ' + p.telefone + ' | Data: ' + p.dataFollow + '\\n';
    });

    MailApp.sendEmail(CONFIG.REP_EMAIL, '📅 Alerta Diário: ' + pendencias.length + ' Follow-ups PlanePrev Agendados', emailText);
  }
}
`;

export function generateCsv(sheetKey: 'pipeline' | 'medicos' | 'cids' | 'followup'): string {
  if (sheetKey === 'pipeline') {
    const header = [
      'ID_Lead', 'Data_Entrada', 'Nome_Paciente', 'Idade', 'Telefone',
      'Regime_Previdenciario', 'Medico_Indicador', 'Clinica', 'Especialidade',
      'Servico', 'Diagnostico_CID10', 'Grau_Urgencia', 'Status_Funil',
      'Honorarios_Estimados_R$', 'Data_Ultimo_Contato', 'Proximo_FollowUp',
      'Canal', 'Checklist_Docs', 'Observacoes'
    ].join(';');

    const rows = mockLeads.map(l => [
      l.id, l.dataEntrada, `"${l.paciente}"`, l.idade, l.telefone,
      `"${l.regime}"`, `"${l.medicoIndicador}"`, `"${l.clinica}"`, `"${l.especialidade}"`,
      `"${l.servico}"`, `"${l.diagnosticoCid}"`, l.urgencia, l.status,
      l.honorariosEstimados, l.dataUltimoContato, l.proximoFollowUp,
      l.canal, l.checklistDocs, `"${l.observacoes}"`
    ].join(';'));

    return [header, ...rows].join('\n');
  }

  if (sheetKey === 'medicos') {
    const header = [
      'ID_Medico', 'Nome_Completo', 'CRM_UF', 'Especialidade',
      'Clinica_Hospital', 'Cidade_UF', 'Secretaria_Gatekeeper',
      'Telefone_Secretaria', 'Melhor_Horario', 'Tier_Parceria',
      'Status_Relacionamento', 'Material_Entregue', 'Leads_Gerados',
      'Contratos_Fechados', 'Taxa_Conversao'
    ].join(';');

    const rows = mockDoctors.map(d => [
      d.id, `"${d.nome}"`, d.crm, `"${d.especialidade}"`,
      `"${d.clinica}"`, `"${d.cidade}"`, `"${d.secretaria}"`,
      d.telefoneSecretaria, `"${d.horarioAbordagem}"`, d.tier,
      d.status, `"${d.materialEntregue}"`, d.leadsGerados,
      d.contratosFechados, d.conversao
    ].join(';'));

    return [header, ...rows].join('\n');
  }

  if (sheetKey === 'cids') {
    const header = [
      'CID_10', 'Patologia', 'Servico_Alvo', 'Enquadramento_Legal',
      'Grau_Urgencia', 'Documentos_Mandatorios', 'Jurisprudencia'
    ].join(';');

    const rows = mockCidLaws.map(c => [
      c.cid, `"${c.patologia}"`, `"${c.servico}"`, `"${c.enquadramentoLegal}"`,
      c.urgencia, `"${c.documentosMandatorios}"`, `"${c.jurisprudencia}"`
    ].join(';'));

    return [header, ...rows].join('\n');
  }

  const header = ['Gatilho', 'Momento', 'Canal', 'Destinatario', 'Objetivo', 'Template_Script'].join(';');
  const rows = mockFollowUpRules.map(f => [
    `"${f.gatilho}"`, f.momento, f.canal, f.destinatario, `"${f.objetivo}"`, `"${f.templateScript.replace(/"/g, '""')}"`
  ].join(';'));

  return [header, ...rows].join('\n');
}
