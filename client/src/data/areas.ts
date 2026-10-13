/**
 * Direção visual: conteúdo jurídico claro dentro de uma estrutura editorial sóbria.
 * Tom: orientativo, cuidadoso e sem promessas de resultado individual.
 */

export type AreaIcon =
  | "calendar"
  | "route"
  | "shield"
  | "compass"
  | "pulse"
  | "badge"
  | "activity"
  | "hand"
  | "baby"
  | "family"
  | "wheat"
  | "refresh"
  | "accessibility"
  | "graduation"
  | "lock"
  | "fileClock"
  | "building"
  | "scale"
  | "gavel";

export type PracticeArea = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  who: string;
  requirements: string[];
  support: string;
  icon: AreaIcon;
};

export const areas: PracticeArea[] = [
  {
    slug: "aposentadoria-por-idade",
    number: "01",
    title: "Aposentadoria por Idade",
    shortTitle: "Por idade",
    summary: "Análise do benefício programado para quem alcançou a idade mínima e reúne o histórico contributivo necessário.",
    who: "Trabalhadores urbanos (empregados, contribuintes individuais, autônomos, MEIs, facultativos, domésticos) que atingiram a idade mínima exigida e têm o tempo mínimo de contribuição.",
    requirements: ["Idade mínima: 65 anos para homens e 62 anos para mulheres. Para as mulheres já filiadas antes da reforma, a idade foi subindo gradualmente até chegar aos 62.", "Tempo de contribuição: mínimo de 15 anos para mulheres e para homens já filiados antes de 13/11/2019. Homens que se filiaram depois dessa data precisam de 20 anos.", "Carência: 180 contribuições mensais, no mínimo.", "Valor: 60% da média de todos os salários de contribuição, mais 2% para cada ano que exceder 15 anos (mulheres) ou 20 anos (homens)."],
    support: "Análise do CNIS e conferência de todos os vínculos e contribuições. Correção de períodos faltantes, salários errados e vínculos não reconhecidos. Simulação para saber quando o benefício será mais vantajoso. Requerimento administrativo e acompanhamento até a concessão. Ação judicial em caso de indeferimento ou de cálculo incorreto.",
    icon: "calendar",
  },
  {
    slug: "aposentadoria-por-tempo-de-contribuicao",
    number: "02",
    title: "Aposentadoria por Tempo de Contribuição",
    shortTitle: "Tempo de contribuição",
    summary: "Avaliação de direito adquirido e regras de transição para segurados com histórico contributivo anterior à Reforma da Previdência.",
    who: "Quem já cumpriu os requisitos até 12/11/2019 (direito adquirido). Quem já era filiado ao INSS antes da reforma (EC 103/2019) e se enquadra em uma das regras de transição. Quem entrou no sistema depois da reforma não tem mais essa modalidade. Para essas pessoas valem as regras permanentes (idade ou especial).",
    requirements: ["Direito adquirido: 35 anos de contribuição (homens) e 30 anos (mulheres), sem idade mínima, desde que completados até 12/11/2019.", "Regra dos pontos: soma de idade e tempo de contribuição (em 2026, 103 pontos para homens e 93 para mulheres, com aumento de 1 ponto por ano), com tempo mínimo de 35 anos (homens) e 30 anos (mulheres).", "Idade mínima progressiva: idade mínima que aumenta 6 meses por ano (em 2026, 64 anos e 6 meses para homens e 59 anos e 6 meses para mulheres), mais 35 ou 30 anos de contribuição.", "Pedágio de 50%: para quem, em 13/11/2019, faltava até 2 anos para completar o tempo mínimo. Paga-se um acréscimo de 50% sobre o tempo que faltava.", "Pedágio de 100%: idade mínima de 60 anos (homens) e 57 anos (mulheres), mais 35/30 anos de contribuição e um pedágio de 100% sobre o tempo que faltava."],
    support: "Planejamento previdenciário: comparação entre todas as regras de transição para indicar a mais vantajosa. Cálculo da data ideal de aposentadoria e do valor estimado. Conferência da contagem de tempo, inclusive tempo especial e rural. Requerimento do benefício e defesa em caso de negativa.",
    icon: "route",
  },
  {
    slug: "aposentadoria-especial",
    number: "03",
    title: "Aposentadoria Especial",
    shortTitle: "Especial",
    summary: "Para trabalhadores expostos, de forma habitual e permanente, a agentes prejudiciais à saúde, conforme os critérios legais.",
    who: "Trabalhadores expostos de forma habitual e permanente a agentes nocivos à saúde ou à integridade física, como ruído, agentes químicos (solventes, poeiras, etc.), agentes biológicos (hospitais, laboratórios) e outros agentes previstos em lei. É comum em áreas como saúde, indústria, mineração, construção, vigilância armada (até 1995, em certas situações) e transportes.",
    requirements: ["Tempo de exposição: 15, 20 ou 25 anos, conforme o grau de risco da atividade.", "Regra permanente (para quem se filiou após a reforma): idade mínima de 55, 58 ou 60 anos, conforme o tempo de exposição exigido, mais o tempo mínimo de atividade especial.", "Transição para quem já era filiado: soma de pontos (idade + tempo de contribuição) de 66, 76 ou 86, conforme a atividade.", "Direito adquirido: quem cumpriu os requisitos até 12/11/2019 pode se aposentar sem idade mínima.", "Prova: PPP (Perfil Profissiográfico Previdenciário), LTCAT, laudos técnicos e demais documentos da empresa.", "Vedação: a partir da reforma, não é mais possível converter tempo especial em comum para períodos posteriores a 13/11/2019 (para períodos anteriores, a conversão segue possível)."],
    support: "Análise de PPP, LTCAT e demais documentos para identificar erros ou omissões. Reconhecimento judicial de períodos especiais quando a empresa não fornece documentos corretos. Conversão de tempo especial em comum, quando cabível. Planejamento para escolher entre a especial e as demais aposentadorias.",
    icon: "shield",
  },
  {
    slug: "planejamento-previdenciario",
    number: "04",
    title: "Planejamento Previdenciário",
    shortTitle: "Planejamento",
    summary: "Uma leitura estratégica do histórico de contribuições antes de tomar decisões relevantes para a aposentadoria.",
    who: "Qualquer pessoa que contribui ou já contribuiu ao INSS e quer saber quando se aposentar, com que valor e como melhorar o benefício. É especialmente importante para quem está perto de cumprir os requisitos e para quem tem períodos incomuns na carteira (rural, especial, autônomo, militar, servidor).",
    requirements: ["Documentos: CNIS, carteiras de trabalho, carnês, PPP, certidões e demais comprovantes.", "Análise individual de todas as regras aplicáveis (permanente, transição, especial, direito adquirido).", "Simulações de valor, data e custo de contribuições adicionais."],
    support: "Levantamento completo do histórico de contribuições. Comparação entre regras, indicando a mais vantajosa e a melhor data. Orientação sobre a forma de contribuir (inclusive complementação, indenização e recolhimentos em atraso). Plano de ação para corrigir pendências antes do requerimento.",
    icon: "compass",
  },
  {
    slug: "beneficio-por-incapacidade-temporaria",
    number: "05",
    title: "Benefício por Incapacidade Temporária",
    shortTitle: "Incapacidade temporária",
    summary: "Proteção ao segurado que, por doença ou acidente, fica temporariamente incapaz para o trabalho ou atividade habitual.",
    who: "Segurados do INSS que ficam temporariamente incapazes para o trabalho por doença ou acidente por mais de 15 dias consecutivos (para empregados, os primeiros 15 dias são pagos pela empresa).",
    requirements: ["Qualidade de segurado.", "Carência de 12 contribuições, dispensada em caso de acidente e de doenças graves previstas em lei.", "Incapacidade temporária comprovada em perícia médica.", "Valor: 91% da média dos salários de contribuição.", "Não vale para doença ou lesão preexistente à filiação, salvo se houver agravamento posterior."],
    support: "Orientação sobre documentos médicos e relatórios que reforçam o pedido. Preparação para a perícia e recurso em caso de negativa ou de alta indevida. Restabelecimento do benefício cessado de forma indevida. Conversão em aposentadoria por incapacidade permanente, se for o caso.",
    icon: "pulse",
  },
  {
    slug: "aposentadoria-por-incapacidade-permanente",
    number: "06",
    title: "Aposentadoria por Incapacidade Permanente",
    shortTitle: "Incapacidade permanente",
    summary: "Análise para situações em que a incapacidade é considerada permanente e não há possibilidade de reabilitação para atividade que garanta subsistência.",
    who: "Segurados considerados incapazes de forma definitiva para qualquer atividade que garanta sua subsistência, sem possibilidade de reabilitação profissional, em razão de doença ou acidente.",
    requirements: ["Qualidade de segurado na data do início da incapacidade.", "Carência de 12 contribuições, dispensada em caso de acidente (de qualquer natureza) e de doenças graves previstas em lei.", "Incapacidade permanente comprovada por perícia médica do INSS.", "Valor: 60% da média, mais 2% por ano que exceder 15 anos (mulheres) ou 20 anos (homens) de contribuição. Se a incapacidade decorrer de acidente de trabalho, doença profissional ou do trabalho, o benefício pode chegar a 100% da média.", "Acréscimo de 25% para quem precisa da assistência permanente de outra pessoa (grande invalidez)."],
    support: "Reunião de laudos, exames e prontuários para sustentar a incapacidade. Acompanhamento da perícia médica e contestação de conclusões equivocadas. Conversão de auxílio por incapacidade temporária em aposentadoria, quando cabível. Ação judicial para concessão, restabelecimento ou revisão do benefício.",
    icon: "badge",
  },
  {
    slug: "auxilio-acidente",
    number: "07",
    title: "Auxílio-Acidente",
    shortTitle: "Auxílio-acidente",
    summary: "Benefício de natureza indenizatória para determinadas situações de sequela permanente que reduzem a capacidade laboral.",
    who: "Segurado que, após a consolidação das lesões decorrentes de acidente (de qualquer natureza), fica com sequela definitiva que reduz sua capacidade para o trabalho que exercia.",
    requirements: ["Qualidade de segurado na data do acidente. Não há carência.", "Sequela definitiva comprovada por perícia médica, com redução da capacidade laboral.", "Valor: 50% do salário de benefício, com natureza indenizatória. Pode ser pago junto com o salário ou outros rendimentos, mas não com aposentadoria (a partir de 1997).", "Não pagos a: empregados domésticos e contribuintes individuais, em regra. Há exceções em casos de decisão judicial."],
    support: "Comprovação da relação entre o acidente e a sequela. Pedido administrativo e ação judicial para concessão do benefício. Revisão do valor ou concessão retroativa quando o INSS negou indevidamente.",
    icon: "activity",
  },
  {
    slug: "bpc-loas",
    number: "08",
    title: "BPC/LOAS",
    shortTitle: "BPC/LOAS",
    summary: "Benefício assistencial para pessoa idosa ou pessoa com deficiência em situação de vulnerabilidade, sem exigência de contribuição ao INSS.",
    who: "Idosos com 65 anos ou mais. Pessoas com deficiência de qualquer idade, com impedimentos de longo prazo. Em ambos os casos, em situação de vulnerabilidade socioeconômica. O BPC não exige contribuição ao INSS e não gera pensão por morte.",
    requirements: ["Renda familiar per capita de até 1/4 do salário mínimo, avaliada junto com outros critérios sociais e econômicos, quando aplicável.", "Inscrição no CadÚnico atualizada.", "Deficiência: avaliação médica e social pelo INSS.", "Valor: 1 salário mínimo mensal."],
    support: "Orientação sobre composição do grupo familiar e cálculo da renda. Atualização do CadÚnico e organização de provas da deficiência e da vulnerabilidade. Acompanhamento da avaliação social e médica. Ação judicial em caso de indeferimento, inclusive por critério de renda.",
    icon: "hand",
  },
  {
    slug: "salario-maternidade",
    number: "09",
    title: "Salário-Maternidade",
    shortTitle: "Salário-maternidade",
    summary: "Benefício devido nos eventos de parto, adoção, guarda para fins de adoção ou aborto não criminoso, conforme a categoria do segurado.",
    who: "Seguradas gestantes que dão à luz. Seguradas que adotam ou obtêm guarda judicial para fins de adoção. Em casos específicos, o segurado pai (por exemplo, falecimento da mãe) ou o cônjuge sobrevivente. Em caso de aborto não criminoso, a segurada recebe por 2 semanas.",
    requirements: ["Qualidade de segurada na data do parto, adoção ou guarda.", "Carência: nenhuma para empregadas, trabalhadoras avulsas e domésticas. Para contribuintes individuais, facultativas e seguradas especiais, são exigidos 10 meses de contribuição ou de atividade rural.", "Duração: 120 dias, podendo ser prorrogada em alguns casos (por exemplo, empresas do Programa Empresa Cidadã).", "Valor: salário integral para empregadas. Para as demais, valor calculado com base nos salários de contribuição, observado o limite legal."],
    support: "Verificação de carência e qualidade de segurada. Requerimento do benefício, inclusive para trabalhadoras rurais e autônomas. Ação judicial em caso de negativa, inclusive por falta de carência ou de documentos.",
    icon: "baby",
  },
  {
    slug: "pensao-por-morte",
    number: "10",
    title: "Pensão por Morte",
    shortTitle: "Pensão por morte",
    summary: "Proteção aos dependentes do segurado que falece ou tem morte presumida reconhecida, conforme as regras previdenciárias.",
    who: "Dependentes do segurado falecido, divididos em classes: 1.	Cônjuge, companheiro(a) (inclusive em união homoafetiva), filhos menores de 21 anos, inválidos ou com deficiência. 2.	Pais. 3.	Irmãos menores de 21 anos, inválidos ou com deficiência. Dependentes de classes superiores excluem os de classes inferiores. A dependência econômica de cônjuge, companheiro e filhos é presumida.",
    requirements: ["Qualidade de segurado do falecido na data do óbito (ou direito já adquirido a uma aposentadoria).", "Comprovação do vínculo de dependência (certidão de casamento, prova de união estável, filiação).", "Duração para cônjuge e companheiro:", "Se o falecido tinha menos de 18 contribuições, ou o casamento/união durou menos de 2 anos, a pensão dura 4 meses.", "Cumpridas essas exigências, a duração depende da idade do beneficiário na data do óbito: de 3 anos (menos de 22 anos) até vitalícia (45 anos ou mais).", "Em caso de invalidez ou deficiência do cônjuge, a pensão dura enquanto durar a condição.", "Valor: 50% do valor da aposentadoria a que o falecido teria direito, mais 10% por dependente, até 100%.", "Prazo para pedir: em até 90 dias do óbito (16 anos para filhos menores, sem prazo) para que o pagamento retroaja à data da morte."],
    support: "Reconhecimento de união estável (judicial ou extrajudicial) e de dependência econômica. Habilitação dos dependentes e divisão correta da pensão. Contestação de negativa por perda da qualidade de segurado. Revisão de pensões concedidas com valores incorretos e cobrança de atrasados.",
    icon: "family",
  },
  {
    slug: "beneficios-trabalhador-rural",
    number: "11",
    title: "Benefícios para Trabalhador Rural",
    shortTitle: "Trabalhador rural",
    summary: "Orientação para segurados especiais e trabalhadores rurais que precisam comprovar atividade no campo perante o INSS.",
    who: "Segurado especial: trabalhador rural em regime de economia familiar, pescador artesanal, extrativista e indígenas que vivem da atividade rural. Trabalhador rural empregado ou diarista (boia-fria). Aposentadoria híbrida: quem trabalhou parte da vida no campo e parte na cidade e não tem tempo suficiente em apenas uma das áreas.",
    requirements: ["Rural por idade: 60 anos (homens) e 55 anos (mulheres), com pelo menos 15 anos de atividade rural comprovada.", "Híbrida: 65 anos (homens) e 62 anos (mulheres), com 15 anos de carência somando tempo rural e urbano.", "Prova do trabalho rural: início de prova material (certidões, documentos escolares, contratos de arrendamento, notas de produtor, carteira de sindicato, declarações do sindicato rural) complementada por prova testemunhal.", "Atenção: o tempo rural deve ser comprovado em período imediatamente anterior ao pedido, na regra do segurado especial."],
    support: "Levantamento e organização de provas materiais do trabalho rural. Preparação para audiência de justificação e depoimento de testemunhas. Reconhecimento de tempo rural anterior e conversão em tempo para a híbrida. Ações judiciais em caso de indeferimento ou de dificuldades de documentação.",
    icon: "wheat",
  },
  {
    slug: "revisao-de-beneficios",
    number: "12",
    title: "Revisão de Benefícios",
    shortTitle: "Revisão",
    summary: "Verificação técnica de benefícios concedidos quando há dúvida sobre tempo, salários, vínculos ou aplicação da regra correta.",
    who: "Aposentados e pensionistas que acreditam que o valor do benefício foi calculado de forma incorreta pelo INSS, ou que períodos de contribuição, tempo especial ou rural ficaram de fora do cálculo.",
    requirements: ["Prazo decadencial de 10 anos, contado do primeiro pagamento ou da decisão administrativa que indeferiu o benefício.", "Erro ou omissão no cálculo: contribuições não consideradas, salários lançados errados, tempo especial ou rural não reconhecido, aplicação de regra menos favorável.", "Teses vigentes: cada revisão tem requisitos próprios, e algumas teses já foram afastadas pelos tribunais superiores (como a revisão da vida toda, que o STF decidiu não ser aplicável). É importante verificar a tese em cada caso."],
    support: "Análise do cálculo de benefícios já concedidos. Identificação de revisões possíveis e do ganho esperado. Pedido administrativo de revisão e ação judicial, com cobrança de diferenças atrasadas. Análise prévia do risco, para não gerar expectativa em teses que não são mais aceitas.",
    icon: "refresh",
  },
  {
    slug: "beneficios-pessoa-com-deficiencia",
    number: "13",
    title: "Benefícios da Pessoa com Deficiência (PCD)",
    shortTitle: "Pessoa com deficiência",
    summary: "Avaliação de aposentadoria da pessoa com deficiência e de benefícios assistenciais, conforme a condição e o histórico individual.",
    who: "Segurados com deficiência física, mental, intelectual ou sensorial de longo prazo, que enfrentam barreiras para participar plenamente da vida em sociedade. A deficiência é avaliada pelo INSS por perícia médica e social, que a classifica como leve, moderada ou grave (Lei Complementar 142/2013).",
    requirements: ["Por tempo de contribuição: o tempo exigido varia conforme o grau da deficiência.", "Grave: 25 anos (homens) e 20 anos (mulheres).", "Moderada: 29 anos (homens) e 24 anos (mulheres).", "Leve: 33 anos (homens) e 28 anos (mulheres).", "Por idade: 60 anos (homens) e 55 anos (mulheres), com 15 anos de contribuição na condição de pessoa com deficiência.", "Prova: laudos médicos, histórico clínico e documentos que mostrem o período da deficiência."],
    support: "Organização da documentação médica e do histórico do segurado. Acompanhamento da perícia médica e social do INSS. Contestação de classificações incorretas do grau de deficiência. Ação judicial para reconhecimento da deficiência e do tempo.",
    icon: "accessibility",
  },
  {
    slug: "aposentadoria-do-professor",
    number: "14",
    title: "Aposentadoria do Professor",
    shortTitle: "Professor",
    summary: "Orientação para professores da educação infantil, ensino fundamental e ensino médio, com análise do efetivo exercício do magistério.",
    who: "Professores que comprovam efetivo exercício de magistério na educação infantil, no ensino fundamental ou no ensino médio. Funções fora da sala de aula exigem análise do caso.",
    requirements: ["Regra permanente: 60 anos para homens e 57 para mulheres, com 25 anos de efetivo exercício de magistério.", "Regras de transição específicas para quem já era filiado ao INSS.", "Direito adquirido para quem completou os requisitos antes da reforma.", "Prova por declarações escolares, contratos, folhas de pagamento e registros funcionais."],
    support: "Verificação do enquadramento, planejamento da transição, simulação das datas, reconhecimento de períodos de docência e atuação judicial quando houver negativa.",
    icon: "graduation",
  },
  {
    slug: "auxilio-reclusao",
    number: "15",
    title: "Auxílio-Reclusão",
    shortTitle: "Auxílio-reclusão",
    summary: "Benefício destinado aos dependentes de segurado de baixa renda preso em regime fechado, conforme os requisitos legais.",
    who: "Dependentes do segurado do INSS de baixa renda que esteja preso em regime fechado.",
    requirements: ["Qualidade de segurado na data da prisão.", "Último salário de contribuição abaixo do limite atualizado em portaria.", "Carência de 24 contribuições mensais.", "Prisão em regime fechado e comprovação periódica da permanência nessa condição."],
    support: "Reunião da certidão carcerária e das provas de dependência, requerimento administrativo, recurso e ação judicial para concessão e cobrança de atrasados.",
    icon: "lock",
  },
  {
    slug: "reconhecimento-tempo-ctc",
    number: "16",
    title: "Reconhecimento de Tempo, Averbação e CTC",
    shortTitle: "Tempo e CTC",
    summary: "Reconhecimento de períodos de trabalho, serviço militar, atividade rural e regimes próprios que não aparecem corretamente no CNIS.",
    who: "Trabalhadores com períodos sem registro, serviço militar, atividade rural, tempo em regime próprio ou outros períodos ausentes no CNIS.",
    requirements: ["Prova do período por documentos da época, testemunhas e, quando cabível, decisões trabalhistas.", "Para alguns períodos, pode ser necessário pagar contribuições em atraso.", "A CTC permite levar tempo do INSS para regime próprio e vice-versa."],
    support: "Pedido de justificação administrativa ou judicial, uso de sentenças trabalhistas, solicitação e conferência de CTC e ação para reconhecimento de tempo recusado.",
    icon: "fileClock",
  },
  {
    slug: "servidores-publicos-rpps",
    number: "17",
    title: "Servidores Públicos",
    shortTitle: "Serviço público",
    summary: "Análise de aposentadoria e pensão para servidores vinculados a regimes próprios da União, estados e municípios.",
    who: "Servidores titulares de cargo efetivo vinculados a regimes próprios e seus dependentes, inclusive em pedidos de pensão por morte.",
    requirements: ["Regras próprias de cada ente, com idade, tempo de contribuição, serviço público e tempo no cargo.", "Regras de transição para quem ingressou antes da reforma, inclusive integralidade e paridade quando cabíveis.", "Os requisitos variam conforme o ente federativo e a data de ingresso."],
    support: "Análise da regra e da melhor data, reconhecimento de tempo anterior por CTC e medidas administrativas ou judiciais contra indeferimento ou cálculo incorreto.",
    icon: "building",
  },
  {
    slug: "cortes-cancelamentos-descontos",
    number: "18",
    title: "Cortes, Cancelamentos e Descontos Indevidos",
    shortTitle: "Cortes e descontos",
    summary: "Defesa de beneficiários diante de suspensões, cancelamentos, cobranças de devolução e descontos não autorizados.",
    who: "Beneficiários com benefício suspenso, cessado ou reduzido sem justificativa, cobrança de valores ou descontos associativos e consignados não autorizados.",
    requirements: ["O INSS deve respeitar contraditório e ampla defesa antes de cortar ou cobrar valores.", "Valores recebidos de boa-fé podem ter proteção contra devolução, conforme o caso.", "Descontos não autorizados podem gerar devolução e indenização.", "Recursos e ações devem observar os prazos específicos."],
    support: "Recurso contra corte ou cobrança, restabelecimento judicial com urgência, cancelamento de descontos, devolução quando cabível e defesa em processos de revisão.",
    icon: "scale",
  },
  {
    slug: "acoes-judiciais-previdenciarias",
    number: "19",
    title: "Ações Judiciais Previdenciárias e Recursos",
    shortTitle: "Ações e recursos",
    summary: "Atuação quando o benefício foi negado, cortado, concedido em valor menor ou quando há demora excessiva do INSS.",
    who: "Qualquer segurado ou dependente que teve benefício negado, cortado, concedido com valor menor ou que enfrenta demora injustificada.",
    requirements: ["Requerimento administrativo prévio, em regra, ou comprovação da negativa.", "Juizados Especiais Federais para causas de até 60 salários mínimos e Justiça Federal comum para valores maiores.", "Possibilidade de recurso ao CRPS e de mandado de segurança em caso de demora injustificada."],
    support: "Elaboração da ação com tutela de urgência quando cabível, acompanhamento de perícias e audiências, recursos, execução da sentença e recebimento de atrasados.",
    icon: "gavel",
  },
];

export const whatsappNumber = "5522998037866";

export function whatsappLink(message: string, number = whatsappNumber) {
  const digits = number.replace(/\D/g, "");
  const normalizedNumber = digits
    ? (digits.startsWith("55") ? digits : `55${digits}`)
    : whatsappNumber;
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
