/**
 * Direção visual: Arquivo de Confiança — dados institucionais claros e centralizados.
 * Este projeto público usa conteúdo estático, sem depender de um painel administrativo.
 */
export const siteContentDefaults = {
  heroTitle: "Dr. Eduardo Ferreira Cavalheiro",
  heroDescription:
    "Orientação jurídica em aposentadorias, benefícios do INSS, planejamento previdenciário e direitos de segurados em Itaperuna/RJ e em todo o Brasil.",
  officeAddress:
    "Rua Thomas Teixeira dos Santos, nº 98, sala 403 · Cidade Nova · Itaperuna/RJ · CEP 28300-000",
  officeHours: "Segunda a domingo · 24 horas",
  whatsapp: "(22) 99803-7866",
  email: "adv@eduardocavalheiro.com",
  instagram: "@eduardof.cavalheiro",
  tiktok: "@eduardocavalheiroadv",
} as const;

export type SiteContentKey = keyof typeof siteContentDefaults;
export type SiteContentValues = Record<SiteContentKey, string>;

export function mapsSearchLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function mapsDirectionsLink(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function useSiteContent(): SiteContentValues {
  return siteContentDefaults;
}
