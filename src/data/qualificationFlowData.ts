export interface UrgencyTier {
  tier: 'P1-Crítica' | 'P2-Alta' | 'P3-Moderada' | 'P4-Estratégica';
  nome: string;
  slaHoras: number;
  corBadge: string;
  descricaoClinica: string;
  perfilPaciente: string;
  servicosAlvo: string[];
  documentosExigidos: string[];
  riscoPericial: 'Baixo (Quase Certo)' | 'Médio (Exige Prova Robusta)' | 'Alto (Depende de Impugnação)';
  acaoImediata: string;
}

export const urgencyTiers: UrgencyTier[] = [
  {
    tier: "P1-Crítica",
    nome: "Urgência Clínica e Financeira Máxima",
    slaHoras: 12,
    corBadge: "bg-red-500/20 text-red-400 border-red-500/40",
    descricaoClinica: "Neoplasia maligna ativa ou recente (qualquer estadiamento), Nefropatia grave em diálise, Cardiopatia grave classe NYHA III/IV, ELA, Parkinson avançado, Estados terminais.",
    perfilPaciente: "Aposentado/Pensionista (INSS ou RPPS) com retenção de IR OU pessoa sem capacidade contributiva com necessidade premente de BPC/LOAS.",
    servicosAlvo: [
      "Isenção de IRPF c/ Restituição Retroativa de 5 anos (Lei 7.713/88)",
      "BPC/LOAS com tramitação prioritária pela Lei 9.784/99",
      "Aposentadoria por Incapacidade Permanente c/ adicional de 25%"
    ],
    documentosExigidos: [
      "Laudo anatomopatológico ou biópsia comprovando malignidade",
      "Relatório médico emitido por especialista com CID-10 e data do primeiro diagnóstico",
      "Exames complementares recentes (Ecocardiograma, Clearance de Creatinina, Tomografia)",
      "Histórico de Créditos de Benefício (HisCre) ou contracheques dos últimos 5 anos"
    ],
    riscoPericial: "Baixo (Quase Certo)",
    acaoImediata: "Contato telefônico em até 4 horas. Coleta de exames no mesmo dia e protocolo prioritário via canal digital em até 48h."
  },
  {
    tier: "P2-Alta",
    nome: "Urgência Alta (Sequelas Funcionais & Retenção Tributária Contínua)",
    slaHoras: 24,
    corBadge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    descricaoClinica: "Sequelas traumáticas consolidadas (fraturas de membros, perda parcial de falanges, lesão ligamentar de joelho/ombro) com retorno ao trabalho CLT; Espondiloartrose severa; Hanseníase tratada.",
    perfilPaciente: "Trabalhador CLT que sofreu acidente qualquer (trânsito, doméstico ou de trabalho) e já teve alta do INSS; Aposentado com diagnóstico de doença crônica há mais de 1 ano.",
    servicosAlvo: [
      "Auxílio-Acidente (Art. 86 Lei 8.213/91) indenizatório mensal até aposentadoria",
      "Isenção de IRPF para portadores de moléstia grave estabilizada"
    ],
    documentosExigidos: [
      "Boletim de primeiro atendimento médico (pronto-socorro da época do acidente)",
      "Comunicação de Acidente de Trabalho (CAT) ou Boletim de Ocorrência (BO)",
      "Exames de imagem demonstrando a consolidação da fratura e redução da mobilidade",
      "Carteira de Trabalho (CTPS) física ou digital comprovando vínculo CLT à época e atual"
    ],
    riscoPericial: "Médio (Exige Prova Robusta)",
    acaoImediata: "Contato em até 24h. Agendamento de sessão de orientação pré-pericial e montagem de dossiê probatório."
  },
  {
    tier: "P3-Moderada",
    nome: "Urgência Moderada (Vulnerabilidade Social ou Benefícios Estáveis)",
    slaHoras: 48,
    corBadge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    descricaoClinica: "Doenças osteomusculares crônicas não acidentárias, limitações auditivas bilaterais moderadas, idoso acima de 65 anos sem renda contributiva.",
    perfilPaciente: "Pessoas de baixa renda inscritas no CadÚnico ou idosos sem suporte previdenciário formal.",
    servicosAlvo: [
      "BPC/LOAS Idoso (65+ anos) ou PcD",
      "Revisão de aposentadoria por tempo ou idade"
    ],
    documentosExigidos: [
      "Cadastro Único (CadÚnico) atualizado nos últimos 24 meses",
      "Documento oficial com foto e CPF de todos os membros do grupo familiar",
      "Comprovantes de despesas com medicamentos e tratamentos não fornecidos pelo SUS"
    ],
    riscoPericial: "Médio (Exige Prova Robusta)",
    acaoImediata: "Triagem em até 48h. Orientação para atualização de CadÚnico no CRAS local e agendamento de protocolo."
  },
  {
    tier: "P4-Estratégica",
    nome: "Planejamento Estratégico & Previdência Médica",
    slaHoras: 72,
    corBadge: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    descricaoClinica: "Sem patologia incapacitante atual. Foco em histórico ocupacional e exposição a agentes nocivos (biológicos/químicos).",
    perfilPaciente: "Médicos, cirurgiões, enfermeiros, empresários de saúde e executivos com múltiplos vínculos de trabalho.",
    servicosAlvo: [
      "Planejamento Previdenciário Consultivo",
      "Aposentadoria Especial com conversão de tempo insalubre pré-Reforma",
      "Recuperação de Pagamentos de INSS acima do teto constitucional (últimos 5 anos)",
      "Planejamento Tributário da Sociedade Médica"
    ],
    documentosExigidos: [
      "Extrato Previdenciário CNIS completo com remunerações",
      "Perfil Profissiográfico Previdenciário (PPP) e LTCAT de hospitais e clínicas",
      "Contratos sociais de pessoas jurídicas (PJ médica) e comprovantes de pró-labore",
      "Declarações de IRPF dos últimos 5 anos"
    ],
    riscoPericial: "Baixo (Quase Certo)",
    acaoImediata: "Reunião executiva agendada em até 72h com apresentação de diagnóstico previdenciário preliminar."
  }
];

export interface LeadQualificationInput {
  regime: string;
  diagnostico: string;
  anoDiagnostico: number;
  idade: number;
  rendaFamiliarPerCapita: number;
  sofreuAcidenteComSequela: boolean;
  temRetencaoIRPF: boolean;
  eMedicoOuProfissionalSaude: boolean;
}

export interface LeadQualificationResult {
  tier: UrgencyTier;
  servicosRecomendados: string[];
  scoreViabilidade: number; // 0-100%
  estimativaEconomica: string;
  documentosChave: string[];
  orientacaoAoRepresentante: string;
}

export function evaluateLeadQualification(input: LeadQualificationInput): LeadQualificationResult {
  const diagLower = input.diagnostico.toLowerCase();
  
  // Condição P1: Câncer, Rim grave, Cardiopatia severa, Parkinson, ELA
  const isDoencaGraveSevera = 
    diagLower.includes('câncer') || diagLower.includes('cancer') || diagLower.includes('neoplasia') ||
    diagLower.includes('renal') || diagLower.includes('rim') || diagLower.includes('hemodiálise') ||
    diagLower.includes('cardio') || diagLower.includes('infarto') || diagLower.includes('insuficiência cardíaca') ||
    diagLower.includes('parkinson') || diagLower.includes('ela') || diagLower.includes('esclerose');

  if (isDoencaGraveSevera && (input.regime.includes('Aposentado') || input.regime.includes('Pensionista') || input.regime.includes('Servidor') || input.temRetencaoIRPF)) {
    const tier = urgencyTiers[0]; // P1-Crítica
    const anos = Math.min(5, Math.max(1, 2026 - input.anoDiagnostico));
    return {
      tier,
      servicosRecomendados: [
        "Isenção de Imposto de Renda (Lei 7.713/88)",
        `Restituição Retroativa dos últimos ${anos} anos de IR pago`,
        "Cessação definitiva da retenção de IRPF no contracheque"
      ],
      scoreViabilidade: 95,
      estimativaEconomica: `Restituição retroativa estimada entre R$ 45.000 e R$ 130.000 + Economia mensal contínua de até R$ 2.500/mês.`,
      documentosChave: tier.documentosExigidos,
      orientacaoAoRepresentante: "Prioridade absoluta de protocolo. Solicite imediatamente os contracheques dos últimos 5 anos e o laudo com o primeiro diagnóstico. O direito independe de sintomas ativos!"
    };
  }

  // Condição P1: BPC por patologia grave sem renda
  if (isDoencaGraveSevera && (input.regime.includes('Sem Contribuição') || input.rendaFamiliarPerCapita < 400)) {
    const tier = urgencyTiers[0];
    return {
      tier,
      servicosRecomendados: [
        "BPC/LOAS Pessoa com Deficiência / Doença Incapacitante (Lei 8.742/93)",
        "Tarifa Social de Energia Elétrica e Medicamentos de Alto Custo"
      ],
      scoreViabilidade: 90,
      estimativaEconomica: "Benefício mensal vitalício de 1 Salário Mínimo (R$ 1.518,00/mês).",
      documentosChave: tier.documentosExigidos,
      orientacaoAoRepresentante: "Auxilie a família com a comprovação dos gastos com fraldas, remédios e transporte para abater do cálculo de renda per capita no CadÚnico."
    };
  }

  // Condição P2: Acidente com sequela (Auxílio-Acidente)
  if (input.sofreuAcidenteComSequela && input.regime.includes('CLT')) {
    const tier = urgencyTiers[1]; // P2-Alta
    return {
      tier,
      servicosRecomendados: [
        "Auxílio-Acidente (Art. 86 da Lei 8.213/91)",
        "Cobrança retroativa das parcelas desde o dia seguinte à cessação do auxílio-doença do INSS"
      ],
      scoreViabilidade: 88,
      estimativaEconomica: "Indenização mensal de 50% da média contributiva até a aposentadoria + retroativo acumulado de até R$ 35.000.",
      documentosChave: tier.documentosExigidos,
      orientacaoAoRepresentante: "Enfatize ao cliente que ele NÃO precisa sair do emprego. O Auxílio-Acidente é cumulativo com o salário e pode ser recebido até o dia em que ele se aposentar!"
    };
  }

  // Condição P4: Médico ou profissional liberal
  if (input.eMedicoOuProfissionalSaude || input.regime.includes('Médico')) {
    const tier = urgencyTiers[3]; // P4-Estratégica
    return {
      tier,
      servicosRecomendados: [
        "Planejamento Previdenciário Especial para Médicos",
        "Recuperação de Pagamentos de INSS acima do teto constitucional (últimos 5 anos)",
        "Aposentadoria Especial com conversão de tempo insalubre"
      ],
      scoreViabilidade: 92,
      estimativaEconomica: "Recuperação média de R$ 25.000 a R$ 60.000 em contribuições duplicadas + otimização de até 40% no valor do benefício futuro.",
      documentosChave: tier.documentosExigidos,
      orientacaoAoRepresentante: "Agende apresentação técnica com o médico ou o gestor da clínica. Médicos que contratam seu planejamento pessoal tornam-se os maiores indicadores de pacientes para Isenção de IR e Auxílio-Acidente!"
    };
  }

  // Condição P3: BPC Idoso ou geral
  if (input.idade >= 65 && input.rendaFamiliarPerCapita < 400) {
    const tier = urgencyTiers[2]; // P3-Moderada
    return {
      tier,
      servicosRecomendados: [
        "BPC/LOAS Idoso (65 anos ou mais)"
      ],
      scoreViabilidade: 85,
      estimativaEconomica: "Benefício mensal de 1 Salário Mínimo (R$ 1.518,00/mês).",
      documentosChave: tier.documentosExigidos,
      orientacaoAoRepresentante: "Verifique se o CadÚnico está ativo e confira se há outros idosos na casa que já recebem BPC (não contam para a renda per capita familiar)."
    };
  }

  // Default P3
  const tier = urgencyTiers[2];
  return {
    tier,
    servicosRecomendados: [
      "Diagnóstico Geral de Viabilidade Previdenciária PlanePrev"
    ],
    scoreViabilidade: 70,
    estimativaEconomica: "Avaliação caso a caso conforme comprovação pericial.",
    documentosChave: tier.documentosExigidos,
    orientacaoAoRepresentante: "Solicite o extrato CNIS no portal Meu INSS e a cópia de laudos médicos para triagem técnica por nossa junta pericial."
  };
}
