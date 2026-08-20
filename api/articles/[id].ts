import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdmin } from "../lib/auth";
import { database, ensureSchema, fromRow, normalizeArticle } from "../lib/database";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "../lib/http";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "PUT") return methodNotAllowed(response, ["PUT"]);
  if (!ensureSameOrigin(request, response)) return;
  if (!isAdmin(request)) return sendJson(response, 401, { error: "Acesso administrativo necessário." });
  const sql = database();
  if (!sql) return sendJson(response, 503, { error: "Banco de dados ainda não configurado." });

  const id = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
  const { article } = readBody<{ article?: unknown }>(request);
  const input = normalizeArticle(article);
  if (!id || !input) return sendJson(response, 400, { error: "Dados do artigo inválidos." });
  await ensureSchema(sql);
  const rows = await sql`UPDATE articles SET slug = ${input.slug}, category = ${input.category}, title = ${input.title}, excerpt = ${input.excerpt}, read_time = ${input.readTime}, published_date = ${input.date}, featured = ${input.featured}, published = ${input.published}, sections = ${JSON.stringify(input.sections)}::jsonb, source_label = ${input.sourceLabel}, source_url = ${input.sourceUrl}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, slug, category, title, excerpt, read_time AS "readTime", published_date AS date, featured, published, sections, source_label AS "sourceLabel", source_url AS "sourceUrl"`;
  if (!rows[0]) return sendJson(response, 404, { error: "Artigo não encontrado." });
  return sendJson(response, 200, { article: fromRow(rows[0] as Record<string, unknown>) });
}
