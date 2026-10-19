export interface ObjectionCard {
  id: string;
  categoria: 'Secretária / Recepção (Gatekeeper)' | 'Médico Parceiro';
  objecao: string;
  subtexto: string;
  respostaSugerida: string;
  gatilhoMental: string;
  dicaPratica: string;
}

export const objectionCards: ObjectionCard[] = [
  {
    id: "rec-01",
    categoria: "Secretária / Recepção (Gatekeeper)",
    objecao: "O médico não atende representantes nem propagandistas aqui na clínica.",
    subtexto: "A secretária foi treinada para filtrar propagandistas de medicamentos e fornecedores de equipamentos.",
    respostaSugerida: "Compreendo perfeitamente, [Nome da Secretária]. Na verdade, eu não sou da indústria farmacêutica nem vendo insumos hospitalares. Meu papel aqui é institucional: represento a PlanePrev, uma consultoria especializada em direitos sociais e tributários do paciente com doença grave. Muitos pacientes da clínica chegam abalados com o custo dos remédios e tratamentos, sem saber que a lei federal lhes garante isenção total de imposto de renda e restituições que podem chegar a dezenas de milhares de reais. Vim apenas entregar gratuitamente este Guia Prático para a recepção disponibilizar aos pacientes que precisarem.",
    gatilhoMental: "Contraste e Humanização (não é vendedor, é apoio assistencial ao paciente vulnerável).",
    dicaPratica: "Chegue bem vestido em tom sóbrio e executivo (blazer ou camisa social), segurando uma pasta executiva, nunca maletas com amostras grátis."
  },
  {
    id: "rec-02",
    categoria: "Secretária / Recepção (Gatekeeper)",
    objecao: "Pode deixar o folheto ou cartão aqui no balcão que eu entrego para o doutor.",
    subtexto: "Forma educada de descartar o material na lixeira assim que o representante virar as costas.",
    respostaSugerida: "Agradeço muito pela sua gentileza, [Nome da Secretária]! Com certeza vou deixar 2 exemplares com você. No entanto, para que o doutor não perca tempo lendo material extenso na correria dos atendimentos, montei uma síntese de 1 lauda com os critérios que os peritos do INSS e da Receita Federal exigem nos laudos para não indeferir os pedidos dos pacientes dele. Se puder me dizer qual o dia em que ele tem 2 minutinhos de intervalo entre o primeiro bloco da manhã ou antes do almoço, eu dou uma passada rápida apenas para entregar a ele em mãos.",
    gatilhoMental: "Respeito ao tempo do médico + oferta de valor técnico que evita retrabalho ao consultório.",
    dicaPratica: "Pergunte o nome da secretária logo na chegada, anote no seu CRM (Aba 02) e trate-a como co-gestora do consultório."
  },
  {
    id: "rec-03",
    categoria: "Secretária / Recepção (Gatekeeper)",
    objecao: "Nós já temos advogados e parceiros jurídicos que atendem a clínica.",
    subtexto: "A secretária assume que a PlanePrev é um escritório de advocacia comum ou concorrente.",
    respostaSugerida: "Que excelente saber que a clínica é tão estruturada! Na verdade, nossa atuação é altamente hiperespecializada em perícia médico-previdenciária e isenção tributária da Lei 7.713/88. Frequentemente nós atuamos em conjunto com os advogados da família e da clínica, prestando cálculos periciais e acelerando a via administrativa sem necessidade de processos judiciais litigiosos demorados. É um suporte complementar sem qualquer custo para a clínica.",
    gatilhoMental: "Complementaridade e não-concorrência.",
    dicaPratica: "Reforce que a PlanePrev prioriza a via administrativa ágil antes de qualquer discussão judicial."
  },
  {
    id: "med-01",
    categoria: "Médico Parceiro",
    objecao: "O Código de Ética Médica (CFM) proíbe médicos de indicarem serviços com contraprestação ou comissão.",
    subtexto: "O médico tem receio de cometer infração ética perante o CRM por mercantilização.",
    respostaSugerida: "Doutor [Nome], sua preocupação é cirúrgica e louvável. Fazemos questão de ressaltar que a PlanePrev respeita rigorosamente as resoluções do CFM. Não há e nunca haverá qualquer repasse financeiro, comissão ou remuneração ao médico ou à clínica. Nosso trabalho é estritamente técnico e assistencial: o senhor realiza a medicina e emite o laudo com a verdade clínica do paciente; nós garantimos que essa verdade clínica seja respeitada pelo INSS e pela Receita Federal, para que o paciente não fique desamparado financeiramente enquanto luta pela saúde.",
    gatilhoMental: "Compliance Ético Inquestionável e Alinhamento com o Juramento de Hipócrates.",
    dicaPratica: "Tenha em mãos o documento de 'Termo de Conformidade Ética e Isenção de Comissões' da PlanePrev assinado pela diretoria jurídica."
  },
  {
    id: "med-02",
    categoria: "Médico Parceiro",
    objecao: "Não tenho tempo para ficar preenchendo formulários e laudos burocráticos do INSS.",
    subtexto: "Médicos têm aversão à burocracia dos órgãos previdenciários e ao retrabalho com exigências.",
    respostaSugerida: "É exatamente por isso que estamos aqui, doutor. Quando o paciente tenta fazer o pedido por conta própria, o INSS frequentemente indefere por falta de um detalhe simples (como a data de início da incapacidade ou o CID exato), forçando o paciente a voltar ao seu consultório pedindo um novo laudo. Nós fornecemos um modelo de relatório padrão de apenas 4 tópicos essenciais que o senhor preenche em 90 segundos durante a consulta normal, garantindo aprovação de primeira e eliminando o retorno desnecessário do paciente.",
    gatilhoMental: "Eliminação de atrito e economia de tempo precioso na rotina médica.",
    dicaPratica: "Entregue a pasta institucional contendo 10 formulários de laudo padrão pré-impressos e um bloco de anotações PlanePrev."
  },
  {
    id: "med-03",
    categoria: "Médico Parceiro",
    objecao: "Meus pacientes são de classe alta e têm plano de saúde premium, não precisam de benefício do governo.",
    subtexto: "O médico confunde Isenção de IRPF (tributário) com benefícios assistenciais de caridade.",
    respostaSugerida: "Compreendo perfeitamente a distinção, doutor. Para pacientes de menor renda, de fato o BPC/LOAS é o caminho. Porém, justamente para o público de alta renda aposentado ou pensionista, a Isenção de Imposto de Renda da Lei 7.713/88 é onde está o maior benefício: um aposentado que recebe proventos expressivos pode recuperar até R$ 150 mil ou mais dos últimos 5 anos de impostos retidos na fonte, além de nunca mais pagar IRPF sobre esses proventos. Esse valor frequentemente financia terapias modernas, imunoterapias e cuidadores.",
    gatilhoMental: "Quebra de paradigma (direito tributário de alta renda vs assistência pública).",
    dicaPratica: "Apresente um caso anônimo real de restituição expressiva de IRPF para um executivo ou médico aposentado."
  },
  {
    id: "med-04",
    categoria: "Médico Parceiro",
    objecao: "O paciente já fez cirurgia e está curado (sem evidência de doença). Ele ainda tem direito à isenção?",
    subtexto: "Dúvida clínica genuína: o médico acha que sem sintomas ativos o direito cessa.",
    respostaSugerida: "Sim, doutor! Esse é um dos pontos mais importantes. A jurisprudência do Superior Tribunal de Justiça (Súmula 598 e Tema 1037) estabelece que a isenção de IRPF por neoplasia maligna é mantida mesmo após a remissão ou cura clínica, porque o paciente permanece vulnerável a recidivas e tem custos contínuos de controle e acompanhamento. O senhor não precisa declarar que ele está em estado terminal; apenas relatar a data do diagnóstico original comprovado pela biópsia.",
    gatilhoMental: "Segurança jurídica e embasamento pacificado em tribunais superiores.",
    dicaPratica: "Mostre o texto exato da Súmula 598 do STJ no seu tablet ou material impresso."
  }
];
