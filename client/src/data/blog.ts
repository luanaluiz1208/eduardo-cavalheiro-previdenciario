export type BlogSection = {
  heading: string;
  body: string;
};

export type BlogArticle = {
  id?: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  featured?: boolean;
  published?: boolean;
  sections: BlogSection[];
  sourceLabel: string;
  sourceUrl: string;
};

export const blogArticles: BlogArticle[] = [
  {
    slug: "aposentadoria-por-idade-por-onde-comecar",
    category: "Aposentadoria",
    title: "Aposentadoria por idade: por onde começar a análise do seu histórico",
    excerpt: "Antes de fazer um pedido, vale conferir idade, carência, tempo de contribuição e a qualidade das informações que aparecem no CNIS.",
    readTime: "5 min de leitura",
    date: "18 ago. 2026",
    featured: true,
    sections: [
      { heading: "O primeiro passo é olhar o histórico, não apenas a idade", body: "<p>A aposentadoria por idade depende de um conjunto de requisitos. A idade mínima é importante, mas a análise também precisa considerar carência, tempo de contribuição e a forma como vínculos e recolhimentos aparecem no Cadastro Nacional de Informações Sociais (CNIS).</p><p>O próprio serviço oficial do INSS indica a necessidade de comprovar carência mínima de 180 contribuições e, em regra, 15 anos de tempo de contribuição para a aposentadoria por idade urbana. A aplicação concreta pode variar conforme a história previdenciária e as regras de transição.</p>" },
      { heading: "Documentos que ajudam a evitar lacunas", body: "<p>CNIS, carteira de trabalho, carnês, certidões e documentos de atividade rural ou especial formam um ponto de partida útil. Quando há períodos ausentes, contribuições com indicador ou vínculos divergentes, o pedido pode exigir uma preparação documental mais cuidadosa.</p><p>Uma conferência prévia também ajuda a identificar se existe período anterior à Reforma da Previdência, atividade especial, trabalho rural ou outra circunstância que altere a análise.</p>" },
      { heading: "Como a orientação profissional pode contribuir", body: "<p>O advogado previdenciarista pode organizar o histórico, comparar as regras potencialmente aplicáveis e indicar quais documentos merecem ser buscados antes do requerimento. O objetivo é transformar informações dispersas em uma rota de análise clara, sem prometer resultado antes de conhecer o caso.</p>" },
    ],
    sourceLabel: "Solicitar Aposentadoria por Idade Urbana — gov.br",
    sourceUrl: "https://www.gov.br/pt-br/servicos/solicitar-aposentadoria-por-idade-trabalhador-urbano",
  },
  {
    slug: "beneficio-por-incapacidade-temporaria-documentos",
    category: "Benefícios por incapacidade",
    title: "Benefício por incapacidade temporária: documentos que organizam o pedido",
    excerpt: "Laudos, exames e informações sobre a atividade profissional ajudam a explicar a incapacidade de forma coerente e verificável.",
    readTime: "4 min de leitura",
    date: "12 ago. 2026",
    sections: [
      { heading: "A incapacidade precisa ser analisada em contexto", body: "<p>O benefício por incapacidade temporária é destinado a situações em que a pessoa segurada fica temporariamente incapaz para o trabalho ou para sua atividade habitual. A documentação médica deve dialogar com as tarefas efetivamente desempenhadas.</p><p>Atestados genéricos podem não explicar a limitação funcional. Relatórios que descrevem diagnóstico, tratamento, prognóstico e restrições ajudam a formar um conjunto mais compreensível para a análise.</p>" },
      { heading: "O que reunir antes de solicitar", body: "<p>É recomendável organizar documentos pessoais, CNIS, carteira de trabalho, atestados, exames, receitas e relatórios médicos. Quando houver acidente de trabalho, a Comunicação de Acidente de Trabalho (CAT) também pode ser relevante.</p><p>A carência, a qualidade de segurado e as hipóteses legais de dispensa precisam ser avaliadas conforme o histórico individual. Por isso, uma lista de documentos não substitui a leitura do caso concreto.</p>" },
      { heading: "A importância de respeitar o canal adequado", body: "<p>O INSS disponibiliza orientações próprias para requerimentos e avaliações de benefícios por incapacidade. A preparação cuidadosa reduz desencontros entre o pedido, os documentos e a realidade do trabalho, mas não permite garantir previamente o resultado da perícia.</p>" },
    ],
    sourceLabel: "Auxílio por Incapacidade Temporária — gov.br",
    sourceUrl: "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-por-incapacidade/auxilio-por-incapacidade-temporaria",
  },
  {
    slug: "bpc-loas-e-cadunico-o-que-observar",
    category: "Benefícios assistenciais",
    title: "BPC/LOAS e CadÚnico: o que observar antes de iniciar a análise",
    excerpt: "O benefício assistencial exige atenção ao grupo familiar, à renda, ao cadastro e, no caso da pessoa com deficiência, à avaliação social e médica.",
    readTime: "5 min de leitura",
    date: "05 ago. 2026",
    sections: [
      { heading: "BPC não é aposentadoria", body: "<p>O Benefício de Prestação Continuada é uma proteção assistencial destinada à pessoa idosa ou à pessoa com deficiência que atenda aos critérios legais de vulnerabilidade. Ele não exige contribuições prévias como uma aposentadoria, mas possui requisitos próprios e não deve ser confundido com benefício previdenciário.</p>" },
      { heading: "Cadastro e composição familiar fazem diferença", body: "<p>O CadÚnico precisa estar atualizado, e a análise considera a composição do grupo familiar e as informações socioeconômicas apresentadas. Documentos de identificação, comprovantes de residência, renda e despesas ajudam a explicar a realidade da família.</p>" },
      { heading: "Quando há deficiência", body: "<p>A avaliação da deficiência envolve aspectos médicos e sociais, além da análise do impedimento de longo prazo e de seus efeitos na participação da pessoa na sociedade. Relatórios médicos e documentos do cotidiano podem contribuir para uma apresentação mais completa, sempre de acordo com a realidade do caso.</p>" },
    ],
    sourceLabel: "Benefício Assistencial à Pessoa com Deficiência — gov.br",
    sourceUrl: "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais/beneficio-assistencial-a-pessoa-com-deficiencia-bpc-loas",
  },
];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

export const blogCategories = ["Todos", ...Array.from(new Set(blogArticles.map((article) => article.category)))];

const monthIndexes: Record<string, number> = {
  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
  jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
};

function articleTimestamp(article: BlogArticle) {
  const nativeDate = Date.parse(article.date);
  if (!Number.isNaN(nativeDate)) return nativeDate;
  const match = article.date.toLocaleLowerCase("pt-BR").match(/(\d{1,2})\s+([a-zç]{3})\.?\s+(\d{4})/);
  if (!match) return 0;
  return new Date(Number(match[3]), monthIndexes[match[2]] ?? 0, Number(match[1])).getTime();
}

export function sortBlogArticles(articles: BlogArticle[]) {
  return [...articles].sort((first, second) => articleTimestamp(second) - articleTimestamp(first));
}

export function useBlogArticles() {
  const [articles, setArticles] = useState<BlogArticle[]>(blogArticles);

  useEffect(() => {
    let active = true;
    fetch("/api/articles")
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { articles?: BlogArticle[] } | null) => {
        if (!active || !payload?.articles?.length) return;
        setArticles((current) => {
          const saved = payload.articles || [];
          const savedSlugs = new Set(saved.map((article) => article.slug));
          return [...saved, ...current.filter((article) => !savedSlugs.has(article.slug))];
        });
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return sortBlogArticles(articles.filter((article) => article.published !== false));
}
import { useEffect, useState } from "react";
