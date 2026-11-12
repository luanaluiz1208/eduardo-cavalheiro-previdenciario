import { useEffect, useState } from "react";
import { areas, type PracticeArea } from "@/data/areas";

export const siteContentDefaults = {
  heroTitle: "Dr. Eduardo Ferreira Cavalheiro",
  heroDescription: "Orientação jurídica em aposentadorias, benefícios do INSS, planejamento previdenciário e direitos de segurados em Itaperuna/RJ e em todo o Brasil.",
  officeAddress: "Rua Thomas Teixeira dos Santos, nº 98, sala 403 · Cidade Nova · Itaperuna/RJ · CEP 28300-000",
  officeHours: "Segunda a domingo · 24 horas",
  whatsapp: "(22) 99803-7866",
  email: "adv@eduardocavalheiro.com",
  instagram: "@eduardof.cavalheiro",
  tiktok: "@eduardocavalheiroadv",
} as const;

export type SiteContentKey = keyof typeof siteContentDefaults;
export type SiteContentValues = Record<SiteContentKey, string>;

export type FaqItem = { question: string; answer: string };
export type CommitmentPoint = { title: string; text: string };
export type AboutHighlight = { title: string };
export type HomeEditableContent = {
  heroKicker: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroNotes: string[];
  aboutName: string;
  aboutLead: string;
  aboutBody: string;
  aboutHighlights: AboutHighlight[];
  aboutCta: string;
  commitmentEyebrow: string;
  commitmentPoints: CommitmentPoint[];
  areasEyebrow: string;
  areasTitle: string;
  areasDescription: string;
  faqsEyebrow: string;
  faqsTitle: string;
  faqsDescription: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  locationNote: string;
  sourceNote: string;
  faqs: FaqItem[];
  areas: PracticeArea[];
};

export type SiteImageKey = "heroBackground" | "heroPortrait" | "aboutPortrait" | "commitmentLogo" | "headerLogo";
export type SiteImages = Record<SiteImageKey, string>;
export const siteImageDefaults: SiteImages = {
  heroBackground: "/assets/hero-arquivo-previdenciario.jpg",
  heroPortrait: "/assets/eduardo-ferreira-cavalheiro-principal.jpeg",
  aboutPortrait: "/assets/eduardo-ferreira-cavalheiro-segunda.jpeg",
  commitmentLogo: "/assets/logo-eduardo-ferreira-cavalheiro-original.jpeg",
  headerLogo: "/assets/logo-eduardo-ferreira-cavalheiro-header.png",
};

export const homeContentDefaults: HomeEditableContent = {
  heroKicker: "Direito Previdenciário",
  heroPrimaryCta: "Conversar pelo WhatsApp",
  heroSecondaryCta: "Conheça as áreas",
  heroNotes: ["Atendimento presencial em Itaperuna", "Consultas on-line em todo o país"],
  aboutName: "Eduardo Ferreira Cavalheiro",
  aboutLead: "É advogado especializado em Direito Previdenciário, com atuação voltada à defesa dos direitos dos segurados perante o INSS e o Poder Judiciário.",
  aboutBody: "Natural de Itaperuna/RJ, realiza atendimentos presenciais e on-line para clientes de todo o Brasil. Atua em demandas relacionadas a benefícios por incapacidade, aposentadorias, pensão por morte, auxílio-acidente, BPC/LOAS e planejamento previdenciário.\n\nSeu trabalho é pautado em análise técnica, estratégia jurídica e atendimento próximo, buscando identificar a melhor solução para cada caso e conduzir o cliente com segurança desde a análise da documentação até a conclusão do processo.",
  aboutHighlights: [
    { title: "Excelência técnica" },
    { title: "Ética inabalável" },
    { title: "Atendimento humanizado" },
    { title: "Agilidade e comprometimento" },
  ],
  aboutCta: "Agendar uma conversa",
  commitmentEyebrow: "Nosso compromisso",
  commitmentPoints: [
    { title: "Transparência", text: "sobre documentos, etapas e possibilidades antes de cada decisão." },
    { title: "Atenção individual", text: "ao histórico de contribuições e às particularidades de cada segurado." },
    { title: "Orientação responsável", text: "para que você compreenda os próximos passos do seu pedido." },
  ],
  areasEyebrow: "ÁREAS DE ATUAÇÃO",
  areasTitle: "Em que podemos ajudar você?",
  areasDescription: "Escolha o tema e veja quem pode ter direito, os requisitos e como o apoio jurídico pode ajudar.",
  faqsEyebrow: "Dúvidas frequentes",
  faqsTitle: "Informação é o primeiro passo para uma decisão mais segura.",
  faqsDescription: "As respostas abaixo são gerais. Cada caso exige análise do histórico, da documentação e da legislação aplicável.",
  contactEyebrow: "Entre em contato",
  contactTitle: "Fale com quem entende de Previdência",
  contactDescription: "Você pode enviar uma mensagem pelo formulário, falar diretamente no WhatsApp ou utilizar um dos canais abaixo.",
  locationNote: "Atendimento presencial mediante agendamento.",
  sourceNote: "O conteúdo do site possui caráter informativo e é atualizado a partir de referências institucionais.",
  faqs: [
    { question: "Preciso ter contribuído para o INSS para buscar o BPC/LOAS?", answer: "Não. O BPC/LOAS é um benefício assistencial, por isso não exige contribuição prévia ao INSS. Ele possui critérios próprios de idade ou deficiência, renda familiar, CadÚnico e, conforme o caso, avaliações do INSS." },
    { question: "Quais documentos devo separar para uma primeira análise?", answer: "Identificação e CPF, CNIS, carteira de trabalho, carnês de contribuição e documentos específicos do seu caso. Para incapacidade, são úteis laudos e exames; para trabalho rural, documentos que comprovem a atividade; para aposentadoria especial, PPP e documentos técnicos." },
    { question: "Todo pedido exige perícia médica?", answer: "Não. A perícia costuma ser importante em benefícios por incapacidade, BPC da pessoa com deficiência e aposentadorias que dependam da avaliação da deficiência. Outros benefícios têm fluxos diferentes. A necessidade é verificada de acordo com o pedido e com a exigência do INSS." },
    { question: "O atendimento pode ser realizado on-line?", answer: "Sim. O escritório atende presencialmente em Itaperuna/RJ e também realiza atendimento on-line para pessoas de todo o território nacional, com orientação adequada a cada etapa." },
    { question: "Meu benefício foi indeferido. Ainda é possível avaliar o caso?", answer: "Sim. Uma decisão negativa pode ser analisada com base no motivo apresentado pelo INSS, nos documentos disponíveis e nos prazos aplicáveis. O primeiro passo é compreender exatamente o que foi reconhecido e o que precisa ser demonstrado." },
    { question: "A orientação jurídica garante a concessão do benefício?", answer: "Não. A concessão depende da legislação, das provas, do histórico contributivo e da análise do órgão competente. O trabalho jurídico é apresentar o caso com organização, coerência técnica e transparência sobre as possibilidades." },
  ],
  areas: areas.map((area) => ({ ...area, requirements: [...area.requirements] })),
};

export function parseHomeContent(value?: string): HomeEditableContent {
  if (!value) return homeContentDefaults;
  try {
    const parsed = JSON.parse(value) as Partial<HomeEditableContent>;
    return {
      ...homeContentDefaults,
      ...parsed,
      heroNotes: Array.isArray(parsed.heroNotes) ? parsed.heroNotes : homeContentDefaults.heroNotes,
      aboutHighlights: Array.isArray(parsed.aboutHighlights) ? parsed.aboutHighlights : homeContentDefaults.aboutHighlights,
      commitmentPoints: Array.isArray(parsed.commitmentPoints) ? parsed.commitmentPoints : homeContentDefaults.commitmentPoints,
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : homeContentDefaults.faqs,
      areas: Array.isArray(parsed.areas) ? parsed.areas : homeContentDefaults.areas,
    };
  } catch { return homeContentDefaults; }
}

export function parseSiteImages(value?: string): SiteImages {
  if (!value) return siteImageDefaults;
  try { return { ...siteImageDefaults, ...(JSON.parse(value) as Partial<SiteImages>) }; } catch { return siteImageDefaults; }
}

export function mapsSearchLink(address: string) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`; }
export function mapsDirectionsLink(address: string) { return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`; }

export function useSiteContent(): SiteContentValues {
  const [content, setContent] = useState<SiteContentValues>(siteContentDefaults);
  useEffect(() => {
    let active = true;
    fetch("/api/content").then((response) => response.ok ? response.json() : null).then((payload: { content?: Partial<SiteContentValues> } | null) => {
      if (active && payload?.content) setContent((current) => ({ ...current, ...payload.content }));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  return content;
}

export function useHomeContent(): HomeEditableContent {
  const [content, setContent] = useState<HomeEditableContent>(homeContentDefaults);
  useEffect(() => {
    let active = true;
    fetch("/api/content").then((response) => response.ok ? response.json() : null).then((payload: { content?: Record<string, string> } | null) => {
      if (active) setContent(parseHomeContent(payload?.content?.homeContent));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  return content;
}

export function useSiteImages(): SiteImages {
  const [images, setImages] = useState<SiteImages>(siteImageDefaults);
  useEffect(() => {
    let active = true;
    fetch("/api/content").then((response) => response.ok ? response.json() : null).then((payload: { content?: Record<string, string> } | null) => {
      if (active) setImages(parseSiteImages(payload?.content?.homeImages));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  return images;
}
