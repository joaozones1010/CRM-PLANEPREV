export interface DoctorProspect {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  clinica: string;
  endereco: string;
  cidadeBairro: string;
  secretaria: string;
  telefoneSecretaria: string;
  telefoneMedico: string;
  melhorHorario: string;
  statusParceria: 'Mapeamento' | '1ª Visita Agendada' | 'Visita Realizada' | 'Proposta Enviada' | 'Parceria Fechada' | 'Em Manutenção';
  dataUltimaVisita: string;
  proximaVisita: string;
  materialEntregue: string;
  termoAssinado: boolean;
  potencialVolume: 'Alto' | 'Médio' | 'Muito Alto';
  observacoes: string;
}

const STORAGE_KEY = 'planeprev_carteira_medicos_v1';

export function getStoredProspects(): DoctorProspect[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Erro ao ler médicos do localStorage:', err);
  }
  // Começa 100% em branco para o usuário preencher com seus dados reais
  return [];
}

export function saveStoredProspects(prospects: DoctorProspect[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
  } catch (err) {
    console.error('Erro ao salvar médicos no localStorage:', err);
  }
}

export const sampleDemonstrationDoctors: DoctorProspect[] = [];


export interface SpecialtyPitch {
  especialidade: string;
  perfilClinica: string;
  ganchoAbertura: string;
  propostaValorClinica: string;
  scriptMedico: string;
  scriptSecretaria: string;
  beneficioParaOMedico: string;
}

export const specialtyPitches: SpecialtyPitch[] = [
  {
    especialidade: "Oncologia Clínica & Hematologia",
    perfilClinica: "Clínicas oncológicas, centros de infusão, consultórios de mastologia e urologia",
    ganchoAbertura: "Desoneração do consultório no preenchimento de relatórios e apoio social nos custos de tratamento do paciente.",
    propostaValorClinica: "Disponibilização gratuita do Guia de Direitos do Paciente e modelo de laudo médico pronto com requisitos da Receita Federal e INSS.",
    scriptMedico: "Doutor, sei que seus pacientes passam por momentos delicados e que o preenchimento de relatórios para o INSS e Receita Federal costuma gerar retrabalho para o seu consultório. A PlanePrev atua em parceria técnica com clínicas de oncologia fornecendo aos seus pacientes assessoria para isenção total de imposto de renda e benefícios sociais, além de disponibilizarmos um modelo de laudo padrão de 1 página que o senhor preenche em 1 minuto e evita exigências periciais. Não há qualquer custo para a clínica e respeitamos rigorosamente todas as normas éticas do CFM.",
    scriptSecretaria: "Olá, [Nome da Secretária]! Vim trazer para a recepção alguns exemplares gratuitos do nosso 'Guia de Direitos do Paciente Oncológico'. Muitas famílias chegam aqui aflitas com custos de exames e medicamentos, e esse material explica com linguagem simples como obter isenção de imposto de renda e auxílios legais. Posso deixar 20 cartilhas com você no balcão e agendar 2 minutos com o Dr. [Nome] apenas para entregar a pasta institucional?",
    beneficioParaOMedico: "Economia de tempo com pedidos de retorno para retificação de laudo e suporte humanizado aos pacientes da clínica."
  },
  {
    especialidade: "Ortopedia & Traumatologia",
    perfilClinica: "Clínicas ortopédicas, centros de reabilitação e consultórios de cirurgia de trauma/membros",
    ganchoAbertura: "Apoio a pacientes que operaram fraturas ou ligamentos e retornam ao trabalho com sequela funcional.",
    propostaValorClinica: "Orientação sobre o direito de Auxílio-Acidente (indenização mensal vitalícia paga pelo INSS cumulativa com o salário).",
    scriptMedico: "Doutor, a grande maioria dos seus pacientes pós-operados de fraturas, ligamentos ou menisco que trabalham com carteira assinada não sabe que, ao receber alta e voltar a trabalhar, tem direito garantido por lei federal a uma indenização mensal de 50% do salário pelo INSS até a aposentadoria (Auxílio-Acidente). Nós estruturamos uma parceria institucional com consultórios ortopédicos para orientar esses pacientes no pós-cirúrgico, sem qualquer envolvimento de cobrança da clínica.",
    scriptSecretaria: "Oi, [Nome da Secretária]! Muitos pacientes operados pelo Dr. [Nome] comentam na recepção sobre a preocupação de voltar ao trabalho após o gesso ou a cirurgia? Nós fornecemos um material educativo excelente que explica como o paciente com sequela funcional pode receber um benefício mensal do governo mesmo continuando a trabalhar. Quero deixar um display para o balcão.",
    beneficioParaOMedico: "Fidelização do paciente com um serviço de amparo pós-operatório estruturado que valoriza a consulta médica."
  },
  {
    especialidade: "Nefrologia (Centros de Diálise)",
    perfilClinica: "Centros de hemodiálise, clínicas de transplante renal e consultórios nefrológicos",
    ganchoAbertura: "Amparo econômico direto a pacientes renais crônicos com transporte, medicação e custos de diálise.",
    propostaValorClinica: "Parceria com o serviço social e corpo clínico para acelerar isenções e BPC/LOAS.",
    scriptMedico: "Doutor, os pacientes em hemodiálise enfrentam uma rotina desgastante e custos elevados de tratamento. A PlanePrev atua em parceria com clínicas de nefrologia cuidando de toda a burocracia pericial de isenção de IRPF e benefícios continuados para os pacientes renais crônicos. Nosso objetivo é garantir que o laudo do senhor seja aceito de primeira, sem idas e vindas burocráticas.",
    scriptSecretaria: "Olá, [Nome da Secretária]! Como os pacientes vêm aqui com frequência semanal para a diálise, nosso papel é apoiar a clínica para que eles tenham acesso a direitos como gratuidade de transporte e isenção de tributos. Gostaria de agendar 5 minutinhos com o diretor clínico para apresentar a parceria.",
    beneficioParaOMedico: "Laudos médicos padronizados e aceitos sem contestações periciais."
  },
  {
    especialidade: "Cardiologia & Cirurgia Cardiovascular",
    perfilClinica: "Consultórios de cardiologia clínica, centros de cateterismo e reabilitação cardíaca",
    ganchoAbertura: "Segurança jurídica na concessão de isenção tributária para cardiopatas graves estáveis.",
    propostaValorClinica: "Desmistificação da necessidade de sintomas graves contemporâneos para garantia de direitos.",
    scriptMedico: "Doutor, muitos pacientes infartados ou revascularizados que estão compensados com medicação continuam tendo direito à isenção integral de imposto de renda sobre a aposentadoria, com restituição retroativa de até 5 anos. Firmamos termos de parceria técnica com consultórios de cardiologia para disponibilizar aos seus pacientes essa assessoria especializada.",
    scriptSecretaria: "Olá, [Nome da Secretária]! Vim entregar um resumo institucional sobre como nossos especialistas apoiam pacientes cardíacos da clínica no resgate de tributos e suporte previdenciário. Qual o melhor dia para eu passar 2 minutinhos com o doutor?",
    beneficioParaOMedico: "Pacientes recuperam valores financeiros expressivos que garantem a adesão ao tratamento medicamentoso contínuo."
  },
  {
    especialidade: "Gestor / Administrador de Clínica Médica",
    perfilClinica: "Policlínicas, hospitais-dia, edifícios médicos e administradores hospitalares",
    ganchoAbertura: "Diferencial de acolhimento ao paciente e ampliação do valor percebido dos serviços da clínica.",
    propostaValorClinica: "Implantação de um 'Espaço de Orientação de Direitos Sociais do Paciente' sem custos para a clínica.",
    scriptMedico: "Prezado Administrador(a), hoje clínicas de referência buscam ir além do diagnóstico clínico e oferecer uma jornada de cuidado integral ao paciente. A PlanePrev propõe uma parceria de cooperação institucional: fornecemos displays, cartilhas educativas e suporte técnico para que os pacientes com doenças graves ou sequelas atendidos em seu centro médico acessem seus direitos de isenção tributária e auxílios previdenciários. Todo o suporte administrativo é nosso, elevando o índice de satisfação (NPS) da clínica sem onerar sua equipe.",
    scriptSecretaria: "Bom dia! Gostaria de agendar uma reunião rápida de 10 minutos com o gestor administrativo da clínica para apresentar nosso projeto institucional de apoio aos pacientes.",
    beneficioParaOMedico: "Diferenciação competitiva da clínica, fidelização de pacientes e zero custo operacional."
  }
];

export const b2bFollowUpCadence = [
  {
    fase: "Pré-Visita (Agendamento)",
    momento: "D-1 da Visita",
    destinatario: "Secretária da Clínica",
    objetivo: "Confirmar a presença do médico no horário combinado e garantir que o atendimento não será interrompido.",
    template: "Olá {{SECRETARIA}}, bom dia! Tudo bem? Aqui é o {{REPRESENTANTE}}, da PlanePrev. Passando apenas para confirmar nossa breve reunião com o {{NOME_MEDICO}} agendada para amanhã às {{HORARIO}}. Serão apenas 5 minutos para entregar o kit institucional e apresentar o modelo de laudo padrão da clínica. Está tudo certo na agenda dele?"
  },
  {
    fase: "Pós-Visita Imediato (Agradecimento)",
    momento: "D+0 (Após a visita)",
    destinatario: "Médico & Secretária",
    objetivo: "Agradecer a atenção, reforçar a conformidade ética e enviar o PDF do Termo de Cooperação Técnica.",
    template: "Dr. {{SOBRENOME_MEDICO}} e {{SECRETARIA}}, agradeço muito pela recepção e pelos minutos dedicados hoje na {{CLINICA}}. Conforme combinamos, segue em anexo a apresentação institucional da PlanePrev e a minuta do Termo de Parceria Técnica. Deixei também no balcão os primeiros exemplares da nossa cartilha de direitos do paciente. Qualquer dúvida, estou à disposição!"
  },
  {
    fase: "Follow-Up da Proposta de Parceria",
    momento: "D+3",
    destinatario: "Secretária ou Médico",
    objetivo: "Saber se conseguiram analisar a minuta do termo e se necessitam de alguma cláusula de ajuste.",
    template: "Olá {{SECRETARIA}}, bom dia! Como vai? O Dr. {{SOBRENOME_MEDICO}} conseguiu dar uma olhada na proposta de cooperação técnica que enviamos no início da semana? Posso passar aí na quinta-feira para recolher a via assinada e já entregar o display oficial para o balcão da recepção?"
  },
  {
    fase: "Ativação & Entrega de Materiais",
    momento: "D+7",
    destinatario: "Secretária da Clínica",
    objetivo: "Instalar o display na recepção e treinar a secretária em 2 minutos sobre como disponibilizar as cartilhas.",
    template: "Olá {{SECRETARIA}}! Excelente notícia termos formalizado a parceria com a {{CLINICA}}. Estou passando hoje aí para entregar o display acrílico com 50 cartilhas 'Direitos do Paciente'. Quando algum paciente comentar sobre dificuldades com custos ou pedir laudo para o INSS/Receita, basta entregar uma cartilha para ele. Você é peça-chave nesse apoio social!"
  },
  {
    fase: "Manutenção & Nutrição Mensal",
    momento: "D+30 (Recorrente)",
    destinatario: "Médico & Secretária",
    objetivo: "Visita de relacionamento, reposição de cartilhas e feedback dos pacientes que foram atendidos com sucesso.",
    template: "Olá {{SECRETARIA}} e Dr. {{SOBRENOME_MEDICO}}! Passando para checar se as cartilhas de recepção estão terminando e já repor um novo lote. Além disso, informo que os pacientes atendidos pela parceria da {{CLINICA}} no último mês já estão com seus processos deferidos sem qualquer exigência ou retrabalho de laudo para o consultório. Grande abraço!"
  }
];

export function buildB2BMasterPrompt(): string {
  return `# PROMPT MESTRE PARA O GOOGLE AI STUDIO: SISTEMA DE PROSPECÇÃO B2B DE MÉDICOS E CLÍNICAS (PLANEPREV)

## 1. PAPEL E CONTEXTO DE ATUAÇÃO (ROLE & PERSONA)
Atue como um Especialista Sênior em Prospecção Comercial B2B e Parcerias Corporativas na Área da Saúde.
Sua missão é estruturar a gestão operacional completa do Representante Externo da PlanePrev voltado EXCLUSIVAMENTE para a PROSPECÇÃO DE MÉDICOS E CLÍNICAS PARCEIRAS.

O representante NÃO atua na venda para pessoas físicas/pacientes no seu dia a dia de campo. Seu foco integral é:
1. Mapear e visitar clínicas, consultórios médicos, hospitais-dia e centros de diagnóstico.
2. Contornar a barreira da secretária (gatekeeper) e obter reuniões breves com o médico ou gestor clínico.
3. Apresentar a PlanePrev como uma parceria técnica e institucional de apoio aos pacientes da clínica.
4. Fechar acordos de cooperação técnica com médicos e clínicas (entrega de cartilhas de recepção, display de balcão e laudo médico modelo).
5. Gerenciar o roteiro diário de visitas, follow-ups de prospecção e manutenção do relacionamento B2B.

---

## 2. ARQUITETURA DO GOOGLE SHEETS PARA PROSPECÇÃO DE MÉDICOS E CLÍNICAS
Estruture 4 abas práticas no Google Sheets:
- Aba 01: 01_Carteira_Medicos_Clinicas (ID_Medico, Nome_Medico, CRM_UF, Especialidade, Nome_Clinica, Endereco_Completo, Bairro_Regiao, Nome_Secretaria, Telefone_Secretaria, Telefone_Medico, Melhor_Horario_Visita, Status_Parceria [Mapeamento | 1ª Visita Agendada | Visita Realizada | Proposta Enviada | Parceria Fechada | Em Manutenção], Data_Ultima_Visita, Proxima_Visita, Material_Entregue, Termo_Assinado [SIM/NÃO], Potencial_Volume [Alto/Médio/Muito Alto], Observacoes_Estrategicas).
- Aba 02: 02_Roteiro_Visitas_Semanal (Data, Horario, Medico_Clinica, Bairro, Objetivo_Visita [Apresentação Inicial / Recolher Termo / Repor Cartilhas / Alinhamento Laudos], Status [Agendado / Realizado / Reagendado], Resultado_Anotado).
- Aba 03: 03_Scripts_Por_Especialidade (Especialidade, Perfil_Clinica, Gancho_Abordagem, Script_Secretaria, Script_Medico, Objeções_Respondidas).
- Aba 04: 04_Regua_FollowUp_B2B (Fase [Pré-Visita D-1, Pós-Visita D+0, D+3, D+7, D+30], Canal [WhatsApp / Presencial], Destinatário [Secretária / Médico / Gestor], Template_Mensagem).

---

## 3. PLAYBOOK DE PROSPECÇÃO POR ESPECIALIDADE MÉDICA
Gere abordagens B2B especializadas para:
1. Oncologia Clínica & Centros de Infusão: Foco na desoneração burocrática de laudos e apoio em custos para pacientes oncológicos.
2. Ortopedia & Traumatologia: Foco no alto volume de cirurgias ortopédicas de trauma e benefícios para pacientes com sequela que continuam trabalhando.
3. Nefrologia & Centros de Hemodiálise: Foco na rotina frequente de pacientes renais e suporte assistencial na clínica.
4. Cardiologia: Foco no suporte a cardiopatas graves que necessitam de amparo para medicamentos de alto custo.
5. Diretores e Gestores de Clínicas Médicas: Proposta de valor institucional para aumentar o NPS e a diferenciação da clínica no mercado.

---

## 4. SCRIPTS DE CONTORNO DE BARREIRA COM SECRETÁRIAS (GATEKEEPERS)
- Script para quando a secretária diz que o médico não atende representantes.
- Script para transformar a secretária em embaixadora do projeto social da clínica.
- Como conseguir o WhatsApp direto do médico de forma profissional e autorizada.

---

## 5. REGRAS DE CONFORMIDADE ÉTICA COM O CFM
- Garantia explícita de ausência de comissões ou repasses pecuniários (em conformidade com o Código de Ética Médica).
- Termo de Cooperação Técnica padrão com foco estritamente institucional.

Gere uma plataforma limpa, sem menção a honorários ou clientes pessoa física, focada 100% no dia a dia do representante em campo fechando parcerias com clínicas médicas.
`;
}
