import { neon } from "@neondatabase/serverless";
import sanitizeHtml from "sanitize-html";

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
  sections: Array<{ heading: string; body: string }>;
  sourceLabel: string;
  sourceUrl: string;
};

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "mark", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "img", "span"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    span: ["style"],
    mark: ["style"],
  },
  allowedStyles: {
    "*": {
      color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(.*\)$/],
      "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(.*\)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noreferrer" }),
  },
};

export function sanitizeArticleBody(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS).trim();
}

export type StoredArticle = ArticleInput & { id: string };

export type StoredComment = {
  id: string;
  articleSlug: string;
  name: string;
  message: string;
  email: string;
  replies: Array<{ id: string; message: string; createdAt: string }>;
  createdAt: string;
};

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
  await sql`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    article_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    replies JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE comments ADD COLUMN IF NOT EXISTS replies JSONB NOT NULL DEFAULT '[]'::jsonb`;
  await sql`CREATE INDEX IF NOT EXISTS comments_article_slug_idx ON comments (article_slug)`;
}

export function commentFromRow(row: Record<string, unknown>): StoredComment {
  return {
    id: String(row.id),
    articleSlug: String(row.articleSlug),
    name: String(row.name),
    message: String(row.message),
    email: String(row.email || ""),
    replies: Array.isArray(row.replies) ? row.replies as StoredComment["replies"] : JSON.parse(String(row.replies || "[]")),
    createdAt: String(row.createdAt),
  };
}

export function normalizeComment(value: unknown): { name: string; message: string; email: string } | null {
  if (!value || typeof value !== "object") return null;
  const item = value as { name?: unknown; message?: unknown; email?: unknown };
  const name = typeof item.name === "string" ? item.name.trim().slice(0, 120) : "";
  const message = typeof item.message === "string" ? item.message.trim().slice(0, 2000) : "";
  const email = typeof item.email === "string" ? item.email.trim().toLowerCase().slice(0, 254) : "";
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { name, message, email };
}

export function normalizeSlug(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase().slice(0, 120).replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") : "";
}

export function fromRow(row: Record<string, unknown>): StoredArticle {
  const rawSections = Array.isArray(row.sections) ? row.sections : JSON.parse(String(row.sections || "[]"));
  const sections = (rawSections as Array<Record<string, unknown>>).map((section) => ({
    heading: String(section.heading || ""),
    body: typeof section.body === "string"
      ? section.body
      : Array.isArray(section.paragraphs)
        ? (section.paragraphs as unknown[]).map((paragraph) => `<p>${String(paragraph)}</p>`).join("")
        : "",
  }));
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
    sections,
    sourceLabel: String(row.sourceLabel),
    sourceUrl: String(row.sourceUrl),
  };
}

export function normalizeArticle(value: unknown): ArticleInput | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<ArticleInput>;
  const clean = (input: unknown, limit = 5000) => typeof input === "string" ? input.trim().slice(0, limit) : "";
  const slug = clean(item.slug, 120).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const sections = Array.isArray(item.sections) ? item.sections.map((section) => {
    const rawBody = (section as { body?: unknown; paragraphs?: unknown }).body;
    const legacyParagraphs = (section as { paragraphs?: unknown }).paragraphs;
    const html = typeof rawBody === "string"
      ? rawBody
      : Array.isArray(legacyParagraphs)
        ? legacyParagraphs.map((paragraph) => `<p>${clean(paragraph, 7000)}</p>`).join("")
        : "";
    return {
      heading: clean((section as { heading?: unknown }).heading, 180),
      body: sanitizeArticleBody(html).slice(0, 20000),
    };
  }).filter((section) => section.heading && section.body).slice(0, 24) : [];

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
