import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdmin } from "../lib/auth";
import { database, ensureSchema, fromRow, normalizeArticle } from "../lib/database";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "../lib/http";

const selectArticles = `SELECT id, slug, category, title, excerpt, read_time AS "readTime", published_date AS date, featured, published, sections, source_label AS "sourceLabel", source_url AS "sourceUrl" FROM articles`;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const sql = database();
  if (request.method === "GET") {
    if (!sql) return sendJson(response, 200, { articles: [] });
    await ensureSchema(sql);
    const rows = await sql(`${selectArticles} ORDER BY updated_at DESC`);
    return sendJson(response, 200, { articles: rows.map((row) => fromRow(row as Record<string, unknown>)) });
  }

  if (request.method !== "POST") return methodNotAllowed(response, ["GET", "POST"]);
  if (!ensureSameOrigin(request, response)) return;
  if (!isAdmin(request)) return sendJson(response, 401, { error: "Acesso administrativo necessário." });
  if (!sql) return sendJson(response, 503, { error: "Banco de dados ainda não configurado." });

  const { article } = readBody<{ article?: unknown }>(request);
  const input = normalizeArticle(article);
  if (!input) return sendJson(response, 400, { error: "Preencha título, categoria, resumo e ao menos uma seção válida." });
  await ensureSchema(sql);
  const id = randomUUID();
  const rows = await sql`INSERT INTO articles (id, slug, category, title, excerpt, read_time, published_date, featured, published, sections, source_label, source_url, updated_at)
    VALUES (${id}, ${input.slug}, ${input.category}, ${input.title}, ${input.excerpt}, ${input.readTime}, ${input.date}, ${input.featured}, ${input.published}, ${JSON.stringify(input.sections)}::jsonb, ${input.sourceLabel}, ${input.sourceUrl}, NOW())
    ON CONFLICT (slug) DO UPDATE SET category = EXCLUDED.category, title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, read_time = EXCLUDED.read_time, published_date = EXCLUDED.published_date, featured = EXCLUDED.featured, published = EXCLUDED.published, sections = EXCLUDED.sections, source_label = EXCLUDED.source_label, source_url = EXCLUDED.source_url, updated_at = NOW()
    RETURNING id, slug, category, title, excerpt, read_time AS "readTime", published_date AS date, featured, published, sections, source_label AS "sourceLabel", source_url AS "sourceUrl"`;
  return sendJson(response, 201, { article: fromRow(rows[0] as Record<string, unknown>) });
}
