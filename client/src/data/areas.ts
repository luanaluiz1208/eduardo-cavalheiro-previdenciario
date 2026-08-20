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
  | "accessibility";

export type PracticeArea = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  who: string;
  requirements: string[];
  support: string;
  documents: string[];
  icon: AreaIcon;
};

export const areas: PracticeArea[] = [
  {
    slug: "aposentadoria-por-idade",
    number: "01",
    title: "Aposentadoria por Idade",
    shortTitle: "Por idade",
    summary: "Análise do benefício programado para quem alcançou a idade mínima e reúne o histórico contributivo necessário.",
    who: "Em regra, é destinada ao segurado urbano que atingiu a idade mínima prevista e possui tempo de contribuição e carência suficientes. Casos rurais, mistos, com direito adquirido ou períodos especiais exigem leitura própria do histórico.",
    requirements: ["Para a regra geral urbana, 65 anos para homens ou 62 anos para mulheres.", "Em regra, 15 anos de contribuição e 180 contribuições mensais de carência.", "CNIS e demais documentos devem refletir corretamente os vínculos e contribuições."],
    support: "O advogado confere o histórico previdenciário, identifica períodos ausentes ou incorretos, avalia regras aplicáveis e orienta a estratégia do requerimento.",
    documents: ["Documento de identificação e CPF", "CNIS e carteira de trabalho", "Carnês e comprovantes de contribuição, se houver", "Documentos de atividade rural ou especial, quando aplicáveis"],
    icon: "calendar",
  },
  {
    slug: "aposentadoria-por-tempo-de-contribuicao",
    number: "02",
    title: "Aposentadoria por Tempo de Contribuição",
    shortTitle: "Tempo de contribuição",
    summary: "Avaliação de direito adquirido e regras de transição para segurados com histórico contributivo anterior à Reforma da Previdência.",
    who: "Pode interessar a quem já possuía períodos relevantes de contribuição antes de 13/11/2019, inclusive quando há possibilidade de direito adquirido ou aplicação de regra de transição.",
    requirements: ["A regra aplicável depende da data dos vínculos, idade e tempo total reconhecido.", "Tempo mínimo tradicionalmente analisado: 30 anos para mulheres e 35 anos para homens.", "Regras de transição podem envolver idade mínima, pontos ou pedágios."],
    support: "O planejamento técnico evita pedidos prematuros: são comparadas as regras possíveis, os tempos reconhecíveis e a estimativa mais adequada ao caso.",
    documents: ["CNIS atualizado", "CTPS, carnês e contratos", "CTC de regimes próprios, se houver", "Documentos de períodos especiais ou rurais, quando existentes"],
    icon: "route",
  },
  {
    slug: "aposentadoria-especial",
    number: "03",
    title: "Aposentadoria Especial",
    shortTitle: "Especial",
    summary: "Para trabalhadores expostos, de forma habitual e permanente, a agentes prejudiciais à saúde, conforme os critérios legais.",
    who: "É voltada ao segurado que exerceu atividade com exposição a agentes nocivos, como ruído, calor, agentes químicos ou biológicos, em condições que atendam à legislação do período trabalhado.",
    requirements: ["Comprovação de 15, 20 ou 25 anos de atividade especial, conforme a exposição.", "Carência de 180 contribuições, em regra.", "PPP e documentos técnicos emitidos pelo empregador são centrais à comprovação.", "Podem existir regra de transição, idade mínima ou direito adquirido conforme as datas do trabalho."],
    support: "O escritório analisa PPPs, vínculos, formulários e a legislação aplicável a cada época; também aponta lacunas documentais e orienta as providências cabíveis.",
    documents: ["PPP — Perfil Profissiográfico Previdenciário", "CTPS e CNIS", "LTCAT ou laudos técnicos, quando disponíveis", "Contracheques e documentos funcionais, se relevantes"],
    icon: "shield",
  },
  {
    slug: "planejamento-previdenciario",
    number: "04",
    title: "Planejamento Previdenciário",
    shortTitle: "Planejamento",
    summary: "Uma leitura estratégica do histórico de contribuições antes de tomar decisões relevantes para a aposentadoria.",
    who: "É indicado para quem se aproxima da aposentadoria, possui períodos simultâneos, atividade rural, exposição especial, vínculos em regime próprio ou dúvidas sobre a melhor regra.",
    requirements: ["Não é um benefício do INSS, mas uma análise individualizada do histórico.", "Exige documentação previdenciária atualizada e dados sobre vínculos e recolhimentos.", "A comparação entre cenários depende da legislação e da realidade de cada segurado."],
    support: "O advogado revisa o CNIS, calcula tempos, identifica pendências, simula cenários e apresenta uma rota clara para decisões mais seguras.",
    documents: ["CNIS completo", "CTPS e carnês", "CTC e holerites, se houver", "Documentos rurais, especiais ou médicos, conforme o histórico"],
    icon: "compass",
  },
  {
    slug: "beneficio-por-incapacidade-temporaria",
    number: "05",
    title: "Benefício por Incapacidade Temporária",
    shortTitle: "Incapacidade temporária",
    summary: "Proteção ao segurado que, por doença ou acidente, fica temporariamente incapaz para o trabalho ou atividade habitual.",
    who: "Pode ser devido ao segurado do INSS cuja incapacidade temporária para o trabalho seja comprovada em perícia, em regra por período superior a 15 dias consecutivos.",
    requirements: ["Manutenção da qualidade de segurado.", "Comprovação da incapacidade em perícia médica ou, nos casos previstos, por análise documental.", "Em regra, carência de 12 contribuições mensais; há hipóteses legais de dispensa."],
    support: "O advogado orienta a organização de laudos e exames, acompanha a coerência do pedido, analisa indeferimentos e explica as alternativas administrativas ou judiciais pertinentes.",
    documents: ["Laudos, atestados, exames e receitas", "Documento de identificação e CPF", "CTPS, CNIS e comprovantes de contribuição", "Comunicação de Acidente de Trabalho — CAT, quando houver"],
    icon: "pulse",
  },
  {
    slug: "aposentadoria-por-incapacidade-permanente",
    number: "06",
    title: "Aposentadoria por Incapacidade Permanente",
    shortTitle: "Incapacidade permanente",
    summary: "Análise para situações em que a incapacidade é considerada permanente e não há possibilidade de reabilitação para atividade que garanta subsistência.",
    who: "Pode ser destinada ao segurado que tenha incapacidade total e permanente reconhecida pela perícia, quando não for viável a reabilitação para outra atividade compatível.",
    requirements: ["Qualidade de segurado na data da incapacidade, salvo situações legalmente previstas.", "Incapacidade permanente e impossibilidade de reabilitação, apuradas em perícia.", "Carência de 12 contribuições em regra, com exceções legais."],
    support: "O escritório organiza a apresentação técnica do caso, verifica o histórico contributivo e médico e avalia a melhor medida diante da decisão do INSS.",
    documents: ["Relatórios médicos detalhados", "Exames, receitas e prontuários disponíveis", "Identificação, CPF, CNIS e CTPS", "Comprovantes de contribuições e vínculos"],
    icon: "badge",
  },
  {
    slug: "auxilio-acidente",
    number: "07",
    title: "Auxílio-Acidente",
    shortTitle: "Auxílio-acidente",
    summary: "Benefício de natureza indenizatória para determinadas situações de sequela permanente que reduzem a capacidade laboral.",
    who: "Pode ser analisado quando, após acidente de qualquer natureza, o segurado apresenta sequela definitiva que reduz sua capacidade para a atividade habitual, observada a categoria de filiação e a legislação aplicável.",
    requirements: ["Ocorrência de acidente e existência de sequela permanente.", "Redução da capacidade para o trabalho habitual, comprovada em avaliação.", "Verificação da qualidade de segurado e do enquadramento da categoria."],
    support: "O advogado examina a documentação médica e previdenciária, esclarece os requisitos do benefício e avalia a medida adequada em caso de negativa.",
    documents: ["Laudos e exames que descrevam a sequela", "CAT, boletim ou documentos do acidente, se houver", "CNIS, CTPS e identificação", "Documentos sobre a atividade habitual"],
    icon: "activity",
  },
  {
    slug: "bpc-loas",
    number: "08",
    title: "BPC/LOAS",
    shortTitle: "BPC/LOAS",
    summary: "Benefício assistencial para pessoa idosa ou pessoa com deficiência em situação de vulnerabilidade, sem exigência de contribuição ao INSS.",
    who: "Pode ser destinado à pessoa com deficiência de longo prazo ou à pessoa idosa com 65 anos ou mais, desde que preenchidos os critérios socioeconômicos e demais exigências legais.",
    requirements: ["Renda familiar por pessoa dentro do parâmetro legal, em regra até 1/4 do salário mínimo.", "CadÚnico atualizado.", "Para pessoa com deficiência, avaliação social e médica e comprovação de impedimento de longo prazo.", "Não exige contribuição prévia ao INSS; não gera 13º salário nem pensão por morte."],
    support: "O escritório orienta a preparação do cadastro, a organização das provas de renda e deficiência, a compreensão das etapas e a análise de decisões administrativas.",
    documents: ["Documentos de todas as pessoas do grupo familiar", "CadÚnico atualizado", "Relatórios, exames e laudos, no caso de deficiência", "Comprovantes de renda, residência e despesas relevantes"],
    icon: "hand",
  },
  {
    slug: "salario-maternidade",
    number: "09",
    title: "Salário-Maternidade",
    shortTitle: "Salário-maternidade",
    summary: "Benefício devido nos eventos de parto, adoção, guarda para fins de adoção ou aborto não criminoso, conforme a categoria do segurado.",
    who: "Pode ser devido a empregadas, MEIs, contribuintes individuais, domésticas, trabalhadoras avulsas, facultativas e desempregadas que preservem a qualidade de segurada, observadas as regras do caso.",
    requirements: ["Evento gerador comprovado: parto, adoção, guarda judicial ou aborto não criminoso.", "Qualidade de segurado na data do evento, conforme a situação.", "Atendimento das condições específicas da categoria de trabalho e do canal correto de requerimento."],
    support: "O advogado identifica o caminho adequado — empresa ou INSS —, confere documentos e presta orientação diante de exigências ou indeferimentos.",
    documents: ["Certidão de nascimento ou de natimorto, quando aplicável", "Atestado médico, nos casos indicados", "Termo de guarda ou nova certidão, na adoção", "Identificação, CPF, CTPS e comprovantes de vínculo"],
    icon: "baby",
  },
  {
    slug: "pensao-por-morte",
    number: "10",
    title: "Pensão por Morte",
    shortTitle: "Pensão por morte",
    summary: "Proteção aos dependentes do segurado que falece ou tem morte presumida reconhecida, conforme as regras previdenciárias.",
    who: "Em geral, pode alcançar cônjuge ou companheiro, filhos e, em determinadas circunstâncias, pais ou irmãos, respeitando a ordem de dependência e as provas exigidas.",
    requirements: ["Óbito ou morte presumida do segurado.", "Qualidade de segurado ou direito adquirido do instituidor, conforme o caso.", "Comprovação da condição de dependente e da documentação familiar necessária."],
    support: "O escritório orienta a montagem documental, verifica a condição previdenciária do falecido e analisa pontos como união estável, dependência e prazo do benefício.",
    documents: ["Certidão de óbito", "Documentos pessoais do requerente e do falecido", "Certidões e provas de vínculo familiar", "CNIS, CTPS e outros documentos previdenciários do instituidor"],
    icon: "family",
  },
  {
    slug: "beneficios-trabalhador-rural",
    number: "11",
    title: "Benefícios para Trabalhador Rural",
    shortTitle: "Trabalhador rural",
    summary: "Orientação para segurados especiais e trabalhadores rurais que precisam comprovar atividade no campo perante o INSS.",
    who: "Pode abranger produtor em regime de economia familiar, pescador artesanal, trabalhador rural e outras categorias previstas, conforme a atividade efetivamente exercida.",
    requirements: ["Comprovação da atividade rural pelo período exigido para cada benefício.", "Documentos contemporâneos que demonstrem o trabalho no campo.", "Regras específicas podem mudar conforme benefício, categoria e existência de contribuições."],
    support: "O advogado identifica provas disponíveis, organiza o conjunto documental e explica como o histórico rural pode dialogar com outros períodos de contribuição.",
    documents: ["Notas fiscais de produtor e blocos rurais", "Documentos de terra, parceria, arrendamento ou comodato", "Certidões, cadastro rural e comprovantes de associação", "Documentos pessoais e provas de atividade da família, quando pertinentes"],
    icon: "wheat",
  },
  {
    slug: "revisao-de-beneficios",
    number: "12",
    title: "Revisão de Benefícios",
    shortTitle: "Revisão",
    summary: "Verificação técnica de benefícios concedidos quando há dúvida sobre tempo, salários, vínculos ou aplicação da regra correta.",
    who: "É indicada para quem já recebe benefício e identifica possível ausência de período contributivo, erro de cadastro, documento novo relevante ou dúvida sobre o cálculo e a regra aplicada.",
    requirements: ["Existência de fundamento jurídico e documental concreto para a revisão.", "Análise de prazos legais e decadenciais aplicáveis.", "Conferência da carta de concessão, CNIS e memória de cálculo, quando disponível."],
    support: "O escritório realiza estudo prévio de viabilidade, explica riscos e benefícios da revisão e orienta a via adequada antes de qualquer pedido.",
    documents: ["Carta de concessão e memória de cálculo", "Extrato de pagamento e número do benefício", "CNIS, CTPS e carnês", "Documentos que comprovem períodos ou salários não considerados"],
    icon: "refresh",
  },
  {
    slug: "beneficios-pessoa-com-deficiencia",
    number: "13",
    title: "Benefícios da Pessoa com Deficiência (PCD)",
    shortTitle: "Pessoa com deficiência",
    summary: "Avaliação de aposentadoria da pessoa com deficiência e de benefícios assistenciais, conforme a condição e o histórico individual.",
    who: "Pode abranger pessoa com deficiência que contribuiu ao INSS e busca aposentadoria por idade ou por tempo, bem como pessoa em vulnerabilidade que avalia o BPC/LOAS.",
    requirements: ["Para aposentadoria por idade da PCD: em regra, 60 anos para homem ou 55 para mulher e 180 meses de contribuição ou atividade rural na condição de PCD.", "A deficiência deve ser avaliada pela perícia médica e pelo serviço social do INSS.", "Para BPC, aplicam-se também os critérios assistenciais de renda e CadÚnico."],
    support: "O advogado ajuda a definir qual proteção corresponde ao caso, organizar documentos médicos e previdenciários e acompanhar a compreensão das avaliações exigidas.",
    documents: ["Laudos, relatórios e exames médicos", "Identificação, CPF, CNIS e CTPS", "CadÚnico e comprovantes de renda, quando houver análise de BPC", "Comprovantes de atividade rural ou contribuições"],
    icon: "accessibility",
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
