export interface SpecialtyPriority {
  id: string;
  nome: string;
  tier: 'Tier 1 - Prioridade Máxima' | 'Tier 2 - Alta Relevância' | 'Tier 3 - Oportunidade Estratégica';
  servicosAlvo: string[];
  volumePacientes: 'Muito Alto' | 'Alto' | 'Médio';
  ticketMedioHonorarios: string;
  velocidadeConversao: 'Rápida (< 15 dias)' | 'Média (15-30 dias)' | 'Consultiva (30-60 dias)';
  dificuldadeAcesso: 'Média' | 'Alta' | 'Muito Alta';
  urgenciaClinica: 'Crítica (P1)' | 'Alta (P2)' | 'Estratégica (P4)';
  ganchoAbordagemMedico: string;
  ganchoSecretaria: string;
  pontosFortes: string[];
  cuidadosEticos: string;
}

export const medicalSpecialties: SpecialtyPriority[] = [
  {
    id: "oncologia",
    nome: "Oncologia Clínica & Hematologia",
    tier: "Tier 1 - Prioridade Máxima",
    servicosAlvo: [
      "Isenção de IRPF por Neoplasia Maligna (Art. 6º, XIV da Lei 7.713/88)",
      "Restituição Retroativa dos últimos 5 anos de IRPF pago",
      "BPC/LOAS para pacientes vulneráveis e sem renda",
      "Planejamento Previdenciário do Oncologista"
    ],
    volumePacientes: "Alto",
    ticketMedioHonorarios: "R$ 12.000 a R$ 25.000 por caso (restituição de 5 anos)",
    velocidadeConversao: "Rápida (< 15 dias)",
    dificuldadeAcesso: "Alta",
    urgenciaClinica: "Crítica (P1)",
    ganchoAbordagemMedico: "Doutor, a Súmula 598 do STJ estabelece que o paciente de câncer tem direito à isenção de IRPF mesmo sem sintomas ativos ou após cura clínica. Apresentamos aos seus pacientes um laudo estruturado nos termos exigidos pela Receita Federal, desonerando o senhor da burocracia documental.",
    ganchoSecretaria: "Olá, Fernanda! Não represento laboratórios de remédios. Trago a cartilha gratuita da PlanePrev 'Direitos Tributários do Paciente Oncológico'. Ela ajuda seus pacientes a recuperarem até R$ 80 mil de imposto de renda retido, o que alivia diretamente as despesas do tratamento.",
    pontosFortes: [
      "Jurisprudência consolidada (STJ / STF)",
      "Tramitação prioritária por lei em processos administrativos e judiciais",
      "Sensibilidade humanitária máxima de médicos e secretárias para com os pacientes"
    ],
    cuidadosEticos: "Nunca abordar o paciente no momento de quimioterapia ou em crise aguda; abordagem deve ser via cartilha informativa na recepção ou por contato consentido pelo familiar."
  },
  {
    id: "nefrologia",
    nome: "Nefrologia (Centros de Diálise & Transplante)",
    tier: "Tier 1 - Prioridade Máxima",
    servicosAlvo: [
      "Isenção de IRPF por Nefropatia Grave",
      "BPC/LOAS para renais crônicos sem capacidade contributiva",
      "Aposentadoria por Incapacidade Permanente c/ adicional de 25%"
    ],
    volumePacientes: "Alto",
    ticketMedioHonorarios: "R$ 8.000 a R$ 18.000",
    velocidadeConversao: "Rápida (< 15 dias)",
    dificuldadeAcesso: "Média",
    urgenciaClinica: "Crítica (P1)",
    ganchoAbordagemMedico: "Doutor, os pacientes em hemodiálise sofrem com custos de transporte e cuidadores. A Lei 7.713/88 concede isenção total de IR na aposentadoria e o BPC/LOAS garante 1 salário mínimo sem carência. Nossa assessoria cuida de todo o processo pericial.",
    ganchoSecretaria: "Como os pacientes vêm aqui 3 vezes por semana para a diálise, temos um modelo de parceria com serviço social para tirar as dúvidas previdenciárias de quem precisa de auxílio transporte e benefício continuado.",
    pontosFortes: [
      "Frequência fixa do paciente na clínica (rotina de hemodiálise)",
      "Gravidade inequívoca nos exames laboratoriais (Clearance de creatinina)",
      "Alta taxa de deferimento administrativo e pericial"
    ],
    cuidadosEticos: "Manter estreita sintonia com o Serviço Social e Psicologia da clínica de diálise."
  },
  {
    id: "ortopedia",
    nome: "Ortopedia & Traumatologia",
    tier: "Tier 1 - Prioridade Máxima",
    servicosAlvo: [
      "Auxílio-Acidente (Lei 8.213/91, Art. 86) - 50% do salário até a aposentadoria",
      "Isenção de IRPF para Espondiloartrose Anquilosante e Paralisia Irreversível",
      "Revisão de Afastamentos Acidentários do INSS (B91)"
    ],
    volumePacientes: "Muito Alto",
    ticketMedioHonorarios: "R$ 6.000 a R$ 14.000 (acumulado retroativo desde a alta médica)",
    velocidadeConversao: "Rápida (< 15 dias)",
    dificuldadeAcesso: "Média",
    urgenciaClinica: "Alta (P2)",
    ganchoAbordagemMedico: "Doutor, a grande maioria dos seus pacientes operados de fraturas, ligamentos ou meniscos tem carteira assinada (CLT) e não sabe que, mesmo voltando a trabalhar normalmente, tem direito a receber uma indenização mensal vitalícia de 50% do INSS (Auxílio-Acidente).",
    ganchoSecretaria: "A clínica atende muitos acidentados de trânsito ou trabalho? O paciente muitas vezes sai da consulta preocupado com o orçamento familiar. Temos um folder educativo sobre o Auxílio-Acidente para deixar no balcão.",
    pontosFortes: [
      "Volume estrondoso de atendimentos semanais",
      "Benefício pouco divulgado pelo próprio INSS (mercado represado)",
      "Paciente não precisa estar incapacitado para trabalhar, apenas ter sequela funcional"
    ],
    cuidadosEticos: "Demonstrar claramente que o laudo do ortopedista apenas descreve a sequela física anatômica e articular, sem vincular juízo de valor jurídico."
  },
  {
    id: "cardiologia",
    nome: "Cardiologia & Cirurgia Cardiovascular",
    tier: "Tier 1 - Prioridade Máxima",
    servicosAlvo: [
      "Isenção de IRPF por Cardiopatia Grave (Infarto, Insuficiência Cardíaca, Pontes)",
      "Planejamento Previdenciário dos Cirurgiões Cardíacos",
      "Aposentadoria por Incapacidade Permanente"
    ],
    volumePacientes: "Alto",
    ticketMedioHonorarios: "R$ 10.000 a R$ 22.000",
    velocidadeConversao: "Média (15-30 dias)",
    dificuldadeAcesso: "Alta",
    urgenciaClinica: "Crítica (P1)",
    ganchoAbordagemMedico: "Doutor, os Tribunais Federais pacificaram que a cardiopatia grave garante a isenção de IRPF retroativa mesmo quando o paciente é revascularizado ou usa marcapasso com sucesso. Orientamos a montagem do prontuário para a perícia sem tomar seu tempo.",
    ganchoSecretaria: "Apresentamos aos pacientes idosos e aposentados atendidos pela cardiologia o acesso à restituição de até 5 anos de imposto de renda, o que custeia os medicamentos de alto custo.",
    pontosFortes: [
      "Alta prevalência em pacientes idosos aposentados com boa renda",
      "Honorários médios expressivos",
      "Médicos de alta remuneração com grande demanda por Planejamento Previdenciário próprio"
    ],
    cuidadosEticos: "Respeitar a autoridade técnica da classificação funcional de NYHA (Classes III e IV)."
  },
  {
    id: "neurologia",
    nome: "Neurologia & Neurocirurgia",
    tier: "Tier 2 - Alta Relevância",
    servicosAlvo: [
      "Isenção de IRPF (Parkinson, AVC com sequela, Esclerose Múltipla)",
      "BPC/LOAS para Transtorno do Espectro Autista (TEA) severo ou sequela neurológica",
      "Auxílio-Acidente para traumatismos cranianos ou periféricos"
    ],
    volumePacientes: "Médio",
    ticketMedioHonorarios: "R$ 9.000 a R$ 20.000",
    velocidadeConversao: "Média (15-30 dias)",
    dificuldadeAcesso: "Alta",
    urgenciaClinica: "Crítica (P1)",
    ganchoAbordagemMedico: "Doutor, laudos de Parkinson e doenças neurodegenerativas costumam ser contestados pelo INSS se não contiverem a data inequívoca dos primeiros sintomas motores. Disponibilizamos um checklist de requisitos periciais para facilitar seus relatórios.",
    ganchoSecretaria: "Muitas famílias com parentes em tratamento neurológico nos procuram perdidas sobre aposentadoria e BPC. Podemos disponibilizar material de orientação jurídica gratuita?",
    pontosFortes: [
      "Doenças expressamente elencadas no rol da Lei 7.713/88",
      "Forte envolvimento de familiares e cuidadores que tomam a decisão rápida",
      "Elegibilidade alta em perícia médica"
    ],
    cuidadosEticos: "Tratamento humanizado com curadores, inventariantes e representantes legais."
  },
  {
    id: "medicos_geral",
    nome: "Corpo Clínico Médico (Todas Especialidades)",
    tier: "Tier 3 - Oportunidade Estratégica",
    servicosAlvo: [
      "Planejamento Previdenciário Especial para Médicos",
      "Aposentadoria Especial com comprovação de Insalubridade (LTCAT / PPP)",
      "Recuperação de Contribuições INSS pagas acima do teto constitucional",
      "Estruturação de Transição de Regimes (RGPS vs RPPS Servidor Público)"
    ],
    volumePacientes: "Médio",
    ticketMedioHonorarios: "R$ 7.500 a R$ 16.000 (honorários diretos de consultoria)",
    velocidadeConversao: "Consultiva (30-60 dias)",
    dificuldadeAcesso: "Média",
    urgenciaClinica: "Estratégica (P4)",
    ganchoAbordagemMedico: "Doutor, mais de 78% dos médicos pagam INSS em duplicidade por trabalharem em hospitais CLT e emitirem nota por PJ, jogando dinheiro fora todo mês. A PlanePrev audita seus recolhimentos dos últimos 5 anos e planeja sua aposentadoria especial antes que novas reformas previdenciárias entrem em vigor.",
    ganchoSecretaria: "Nosso consultor veio conversar com o doutor sobre a consultoria previdenciária e tributária para os próprios médicos da clínica.",
    pontosFortes: [
      "Médico se torna cliente da PlanePrev e, naturalmente, passa a indicar seus pacientes",
      "Público de altíssimo poder aquisitivo e carência de tempo para burocracia",
      "Possibilidade de contratos coletivos com todo o corpo clínico de hospitais"
    ],
    cuidadosEticos: "Postura 100% executiva, consultiva e técnica, sem apelos sensacionalistas."
  }
];
