import { neon } from "@neondatabase/serverless";

export type ContentKey = "heroTitle" | "heroDescription" | "officeAddress" | "officeHours" | "whatsapp" | "email" | "instagram" | "tiktok";

export type ArticleInput = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  featured: boolean;
  published: boolean;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  sourceLabel: string;
  sourceUrl: string;
};

export type StoredArticle = ArticleInput & { id: string };

export function database() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export async function ensureSchema(sql: NonNullable<ReturnType<typeof database>>) {
  await sql`CREATE TABLE IF NOT EXISTS site_content (
    content_key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    read_time TEXT NOT NULL,
    published_date TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    sections JSONB NOT NULL,
    source_label TEXT NOT NULL,
    source_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

export function fromRow(row: Record<string, unknown>): StoredArticle {
  return {
    id: String(row.id),
    slug: String(row.slug),
    category: String(row.category),
    title: String(row.title),
    excerpt: String(row.excerpt),
    readTime: String(row.readTime),
    date: String(row.date),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    sections: Array.isArray(row.sections) ? row.sections as ArticleInput["sections"] : JSON.parse(String(row.sections || "[]")),
    sourceLabel: String(row.sourceLabel),
    sourceUrl: String(row.sourceUrl),
  };
}

export function normalizeArticle(value: unknown): ArticleInput | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<ArticleInput>;
  const clean = (input: unknown, limit = 5000) => typeof input === "string" ? input.trim().slice(0, limit) : "";
  const slug = clean(item.slug, 120).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const sections = Array.isArray(item.sections) ? item.sections.map((section) => ({
    heading: clean((section as { heading?: unknown }).heading, 180),
    paragraphs: Array.isArray((section as { paragraphs?: unknown }).paragraphs)
      ? (section as { paragraphs: unknown[] }).paragraphs.map((paragraph) => clean(paragraph, 7000)).filter(Boolean).slice(0, 16)
      : [],
  })).filter((section) => section.heading && section.paragraphs.length).slice(0, 24) : [];

  if (!slug || !clean(item.title, 220) || !clean(item.category, 120) || !clean(item.excerpt, 900) || !sections.length) return null;
  const sourceUrl = clean(item.sourceUrl, 2000);
  if (sourceUrl) {
    try { new URL(sourceUrl); } catch { return null; }
  }

  return {
    slug,
    category: clean(item.category, 120),
    title: clean(item.title, 220),
    excerpt: clean(item.excerpt, 900),
    readTime: clean(item.readTime, 80) || "5 min de leitura",
    date: clean(item.date, 80) || new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
    featured: Boolean(item.featured),
    published: item.published !== false,
    sections,
    sourceLabel: clean(item.sourceLabel, 220) || "Fonte oficial",
    sourceUrl,
  };
}
