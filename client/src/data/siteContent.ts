/**
 * Direção visual: Arquivo de Confiança — dados institucionais claros e centralizados.
 * Valores estáticos sustentam o site até que a base conectada ao painel esteja configurada.
 */
import { useEffect, useState } from "react";
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
  const [content, setContent] = useState<SiteContentValues>(siteContentDefaults);

  useEffect(() => {
    let active = true;
    fetch("/api/content")
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { content?: Partial<SiteContentValues> } | null) => {
        if (active && payload?.content) setContent((current) => ({ ...current, ...payload.content }));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return content;
}
