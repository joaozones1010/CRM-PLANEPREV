export interface PromptParameters {
  repProfile: string;
  region: string;
  primaryServiceFocus: string;
  monthlyGoal: number;
  doctorSpecialtyFocus: string;
  includeAppsScript: boolean;
  includeCidMatrix: boolean;
}

export const defaultPromptParams: PromptParameters = {
  repProfile: "Representante Comercial Externo Especialista em Saúde & Direito Previdenciário",
  region: "Capitais e Polos Médicos Regionais (Clínicas, Hospitais e Consultórios)",
  primaryServiceFocus: "Todos (Isenção IRPF Moléstia Grave, Planejamento Previdenciário Médico, Auxílio-Acidente, BPC/LOAS)",
  monthlyGoal: 35,
  doctorSpecialtyFocus: "Oncologia, Nefrologia, Ortopedia/Traumatologia, Cardiologia e Cirurgia Geral",
  includeAppsScript: true,
  includeCidMatrix: true,
};

export function buildMasterPrompt(params: PromptParameters = defaultPromptParams): string {
  return `# PROMPT MESTRE PARA O GOOGLE AI STUDIO: SISTEMA INTEGRADO DE GESTÃO E CRM PARA REPRESENTANTE EXTERNO DA PLANEPREV

## 1. PAPEL E CONTEXTO DE ATUAÇÃO (ROLE & PERSONA)
Atue como um **Especialista Sênior em Automação de Processos Comerciais, CRM e Inteligência de Negócios na Área da Saúde**, com profundo domínio em **Direito Previdenciário (INSS/RPPS) e Tributário em Saúde (Lei Federal nº 7.713/1988)**.

Sua missão é projetar e fornecer a **arquitetura operacional completa de gestão comercial, CRM no Google Sheets e playbooks de campo** para o **Representante Externo da PlanePrev** (${params.repProfile}) atuando em ${params.region}.

A **PlanePrev** é uma assessoria e consultoria especializada que transforma diagnósticos clínicos e históricos de trabalho em direitos econômicos e previdenciários concretos, prestando serviços de:
1. **Isenção de Imposto de Renda por Doença Grave** (Lei 7.713/88, Art. 6º, XIV): Para aposentados, pensionistas e reformados com patologias como câncer, nefropatia, cardiopatia, Parkinson, etc. Inclui restituição retroativa dos últimos 5 anos de IR indevidamente retido na fonte.
2. **Planejamento Previdenciário para Médicos e Profissionais da Saúde**: Adequação de regras de transição (EC 103/2019), aposentadoria especial de médico (insalubridade e agentes biológicos), compensação entre RGPS/RPPS e elisão tributária para PJ médica.
3. **Auxílio-Acidente (Benefício Indenizatório Mensal)**: Art. 86 da Lei 8.213/91. Benefício pago pelo INSS de 50% do salário de benefício até a aposentadoria, sem exigir afastamento do emprego, voltado para trabalhadores que sofreram qualquer acidente (típico ou de trajeto) e ficaram com sequela redutora da capacidade laborativa.
4. **BPC/LOAS (Benefício de Prestação Continuada)**: Lei 8.742/93. 1 salário mínimo mensal para pessoas com deficiência ou doenças graves de longo prazo e idosos em situação de vulnerabilidade socioeconômica, sem necessidade de contribuição ao INSS.

---

## 2. ARQUITETURA COMPLETA DA PLATAFORMA CRM NO GOOGLE SHEETS
Projete uma plataforma estruturada no Google Sheets dividida em 5 abas funcionais, contendo o dicionário de dados exato, regras de validação, formatação condicional inteligente e fórmulas prontas:

### ABA 1: \`01_Pipeline_Leads\` (Gestão Operacional de Oportunidades)
- **Colunas Obrigatórias**:
  - \`ID_Lead\` (Formato: \`PLP-2026-0001\`)
  - \`Data_Entrada\` (DD/MM/AAAA)
  - \`Nome_Paciente_Lead\` (Texto)
  - \`Idade_Faixa\` (Numérico / Categoria)
  - \`Telefone_WhatsApp\` (Validação: (XX) 9XXXX-XXXX)
  - \`Regime_Previdenciario\` (Lista Suspensa: Aposentado INSS | Pensionista INSS | Servidor Público RPPS | CLT Ativo | Autônomo/Sem Contribuição | Médico/Empresário)
  - \`Medico_Indicador\` (Referência da Aba 02)
  - \`Clinica_Hospital\` (Texto)
  - \`Especialidade_Origem\` (Lista Suspensa: Oncologia | Nefrologia | Cardiologia | Ortopedia | Neurologia | Geral)
  - \`Servico_Alvo\` (Lista Suspensa: Isenção IR Moléstia Grave | Planejamento Médico | Auxílio-Acidente | BPC/LOAS | Múltiplo)
  - \`Diagnostico_CID10\` (Texto + Código CID)
  - \`Grau_Urgencia\` (Lista Suspensa: P1-Crítica [Vermelho] | P2-Alta [Laranja] | P3-Moderada [Amarelo] | P4-Estratégica [Azul])
  - \`Status_Funil\` (Lista Suspensa: Novo Lead | Triagem Inicial | Laudo em Análise | Reunião Agendada | Proposta Enviada | Contrato Fechado | Protocolo no INSS/Receita | Concluído/Ganho | Perdido/Desqualificado)
  - \`Honorarios_Estimados_R$\` (Fórmula ou Valor em Moeda)
  - \`Data_Ultimo_Contato\` (Data)
  - \`Proximo_FollowUp\` (Data com alerta condicional para vencimento)
  - \`Canal_Contato\` (WhatsApp | Visita Presencial | Ligação | E-mail)
  - \`Checklist_Documentos\` (Status de Documentos: Pendente | 50% | 100%)
  - \`Observacoes_Criticas\` (Notas do Representante)

### ABA 2: \`02_Medicos_e_Clinicas\` (CRM de Parceiros e Gatekeepers)
- **Colunas**:
  - \`ID_Medico\` | \`Nome_Completo\` | \`CRM_UF\` | \`Especialidade\`
  - \`Hospital_Clinica_Principal\` | \`Endereco_Bairro\`
  - \`Nome_Secretaria_Gatekeeper\` (Fundamental para o representante)
  - \`Telefone_Secretaria_Direto\` | \`Melhor_Horario_Abordagem\`
  - \`Tier_Parceria\` (Tier 1 - Alto Volume | Tier 2 - Médio Volume | Tier 3 - Ocasional)
  - \`Status_Relacionamento\` (Mapeamento | 1ª Visita Feita | Apresentação Concluída | Parceiro Ativo | Em Nutrição)
  - \`Material_Entregue\` (Cartilha Direitos do Paciente | Display Balcão | Pasta Laudos Padrão)
  - \`Total_Leads_Gerados\` (Fórmula \`COUNTIF\` cruzando com Aba 1)
  - \`Total_Contratos_Fechados\` (Fórmula \`COUNTIFS\`)
  - \`Taxa_Conversao_%\`

### ABA 3: \`03_Matriz_CIDs_Previdenciario\` (Dicionário Clínico-Jurídico)
- Mapeamento completo cruzando:
  - \`CID_10\` | \`Patologia\` | \`Enquadramento Legal (Lei 7.713/88 / Lei 8.213/91)\`
  - \`Servico_PlanePrev_Correspondente\`
  - \`Nivel_Urgencia_Pericial\` (P1 a P4)
  - \`Documentos_Medicos_Mandatorios\` (Biópsia, Ressonância, Laudo com CID e data de início)
  - \`Súmulas e Jurisprudência Relevante\` (Ex: Súmula 598 do STJ - Desnecessidade de laudo oficial contemporâneo com sintomas)

### ABA 4: \`04_Regua_FollowUp\` (Automação de Pipeline)
- Tabela com fases temporais (D+0, D+1, D+3, D+7, D+15, D+30), público-alvo (Médico, Secretária, Paciente) e scripts prontos parametrizáveis.

### ABA 5: \`05_Dashboard_KPIs\` (Painel de Metas)
- Fórmulas dinâmicas: Metas mensais (${params.monthlyGoal} contratos), Faturamento Projetado, Conversão por Especialidade Médica, Tempo Médio de Ciclo.

${params.includeAppsScript ? `
### AUTOMAÇÃO GOOGLE APPS SCRIPT
Inclua o código completo em Google Apps Script pronto para colar no editor de script da planilha, realizando:
1. Alerta automático de Follow-ups atrasados via e-mail diário para o representante.
2. Disparo de webhook para WhatsApp/Slack quando um lead \`P1-Crítica\` é registrado.
3. Atualização automática de datas e coloração de linhas por urgência.
` : ''}

---

## 3. MATRIZ DE PRIORIZAÇÃO POR ESPECIALIDADES MÉDICAS
Gere uma matriz analítica de priorização com critérios objetivos:
1. **Oncologia Clínica & Hematologia** (Tier 1 - Prioridade Máxima):
   - Foco: Isenção de IRPF (diagnóstico de neoplasia maligna independe de sintomas ativos conforme STJ) e BPC/LOAS para pacientes vulneráveis.
   - Justificativa de Prioridade: Urgência clínica máxima, alto valor de restituição retroativa de 5 anos para aposentados e rapidez processual com tramitação prioritária por lei.
2. **Nefrologia (Centros de Diálise e Transplante)** (Tier 1):
   - Foco: Isenção de IRPF (Nefropatia Grave) e BPC/LOAS. Pacientes em hemodiálise possuem rotina frequente em clínicas, facilitando contato ético.
3. **Cardiologia & Cirurgia Cardiovascular** (Tier 1):
   - Foco: Isenção de IRPF (Cardiopatia Grave - Infarto agudo, insuficiência cardíaca crônica) e Planejamento Previdenciário dos próprios cirurgiões cardíacos.
4. **Ortopedia & Traumatologia** (Tier 1 - Alto Volume):
   - Foco: Auxílio-Acidente (fraturas, lesões de menisco/ligamento, lesões por esforço com sequela de mobilidade que retornaram ao trabalho) e Isenção de IRPF (Espondiloartrose Anquilosante).
5. **Neurologia & Neurocirurgia** (Tier 2):
   - Foco: Parkinson, Esclerose Múltipla, Sequelas de AVC (Isenção de IR + BPC).
6. **Corpo Clínico & Cirurgiões Gerais** (Tier 1 Estratégico):
   - Foco: Planejamento Previdenciário Exclusivo para os Médicos (Gestão de múltiplos vínculos, INSS teto duplicado, aposentadoria especial e transição).

---

## 4. PLAYBOOK DE ABORDAGEM & CONTORNO DE BARREIRAS (RECEPCIONISTAS E MÉDICOS)

### A. ESTRATÉGIA PARA A RECEPÇÃO / SECRETÁRIA ("A GUARDIÃ")
- **Princípio**: Nunca trate a secretária como um obstáculo a ser driblado, mas como a **gestora do bem-estar dos pacientes e do tempo do médico**.
- **Técnica do Kit de Apoio Social**: O representante não se apresenta como "vendedor de consultoria", mas como "Consultor de Apoio a Direitos Sociais do Paciente da Clínica".
- **Scripts Validados**:
  - *Objeção 1*: "O doutor não atende representantes."
    - *Resposta*: "Compreendo perfeitamente, [Nome da Secretária]. Na verdade, não sou da indústria de medicamentos nem vendo produtos. Meu trabalho é apoiar a clínica para que os pacientes com diagnósticos graves (como câncer ou cardiopatia) tenham acesso a direitos garantidos por lei federal, como isenção de imposto e auxílios que ajudam a pagar o próprio tratamento. Trouxe apenas 2 exemplares do 'Guia Prático de Direitos Sociais do Paciente' para deixar com você. Poderia apenas assinar o recebimento para eu anexar ao relatório da clínica?"
  - *Objeção 2*: "Deixe o folheto aí no balcão que eu passo para ele."
    - *Resposta*: "Perfeito, deixo sim! Para não sobrecarregar o doutor na correria das consultas, preparei um resumo de 1 página sobre como preencher o laudo médico de forma a evitar que o INSS indefira pedidos de pacientes dele. Qual o melhor dia da semana em que a agenda dele costuma ter 3 minutos entre o primeiro e o segundo bloco de atendimentos?"

### B. ESTRATÉGIA COM O MÉDICO (CONFORMIDADE ÉTICA CFM)
- **Segurança Ética**: Deixar claro que a PlanePrev opera em conformidade estrita com o Código de Ética Médica (sem qualquer comissão financeira vedada pelo CFM), focando na **desoneração do consultório** (o médico não precisa virar perito nem gastar tempo elaborando defesas burocráticas).
- **Proposta de Valor**: "Doutor, você faz o diagnóstico e salva a vida do paciente; a PlanePrev garante a segurança jurídica e financeira para ele suportar os custos do tratamento."

---

## 5. FLUXO DE QUALIFICAÇÃO DE LEADS POR URGÊNCIA DE DIAGNÓSTICO
Crie uma árvore de decisão clínica-previdenciária em 4 níveis de prioridade (SLA):
- **P1 - Urgência Crítica (SLA de Contato < 12h)**:
  - Diagnósticos: Neoplasia Maligna em tratamento/avançada, Esclerose Lateral Amiotrófica (ELA), Cardiopatia Terminal, Insuficiência Renal Crônica em Hemodiálise.
  - Perfil: Aposentado/Pensionista pagando IR ou paciente sem renda que necessita de BPC urgente.
  - Ação: Prioridade no protocolo da Receita/INSS com pedido de tramitação prioritária pela Lei 9.784/99.
- **P2 - Urgência Alta (SLA de Contato < 24h)**:
  - Diagnósticos: Sequelas pós-traumáticas recentes (fraturas consolidadas de membros com retorno ao trabalho CLT), Parkinson ou Cardiopatias graves compensadas.
  - Perfil: Segurado CLT elegível ao Auxílio-Acidente ou aposentado com retenção contínua de IRPF nos últimos 5 anos.
- **P3 - Urgência Moderada (SLA < 48h)**:
  - Diagnósticos: Sequelas crônicas antigas, osteoartrose severa, perda auditiva ocupacional.
  - Perfil: BPC/LOAS idoso ou trabalhador rural/informal.
- **P4 - Preventiva / Estratégica (SLA < 72h)**:
  - Diagnósticos: Ausência de patologia grave.
  - Perfil: Médicos e sócios de clínicas com mais de 10 anos de contribuição médica buscando Planejamento Previdenciário e Blindagem Tributária.

---

## 6. CRONOGRAMA AUTOMATIZADO DE FOLLOW-UP (CADÊNCIA DE NUTRIÇÃO)
Defina a régua temporal multicanal detalhada:
- **D+0 (Dia da Apresentação/Coleta do Lead)**: Mensagem de acolhimento e confirmação da recepção da solicitação.
- **D+1 (Análise Preliminar de Laudos)**: Diagnóstico de viabilidade pericial enviado ao paciente/familiar.
- **D+3 (Status de Elegibilidade & Parecer)**: Apresentação do plano de ação e cálculo da restituição de IR / benefício mensal.
- **D+7 (Fechamento & Assinatura de Contrato)**: Alinhamento de procuração e protocolo.
- **D+15 (Acompanhamento Pericial e Provas)**: Nutrição sobre o andamento no portal Meu INSS / e-CAC.
- **D+30 (Status da Parceria com a Clínica)**: Relatório de devolutiva ética ao médico parceiro ("Doutor, 3 pacientes indicados por sua equipe já obtiveram a isenção de IR este mês").

---

## 7. FORMATO DE SAÍDA ESPERADO
Gere uma resposta primorosa, em português do Brasil, contendo:
1. Todas as tabelas prontas para copiar e colar diretamente no Google Sheets.
2. Scripts literais prontos para envio no WhatsApp e abordagem presencial.
3. Código completo do Google Apps Script com comentários e instruções de instalação.
4. Indicadores de desempenho (KPIs) recomendados para o representante externo bater sua meta de ${params.monthlyGoal} contratos/mês.
`;
}
