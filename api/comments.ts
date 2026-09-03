import { randomUUID } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { commentFromRow, database, ensureSchema, normalizeComment, normalizeSlug } from "./lib/database.js";
import { isAdmin } from "./lib/auth.js";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "./lib/http.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const sql = database();

  if (request.method === "GET") {
    if (!request.query.slug && isAdmin(request)) {
      if (!sql) return sendJson(response, 200, { comments: [] });
      await ensureSchema(sql);
      const rows = await sql`SELECT id, article_slug AS "articleSlug", name, message, email, created_at AS "createdAt" FROM comments ORDER BY created_at DESC LIMIT 100`;
      return sendJson(response, 200, { comments: rows.map((row) => commentFromRow(row as Record<string, unknown>)) });
    }
    const slug = normalizeSlug(request.query.slug);
    if (!slug) return sendJson(response, 400, { error: "Parâmetro slug é obrigatório." });
    if (!sql) return sendJson(response, 200, { comments: [] });
    await ensureSchema(sql);
    const rows = await sql`SELECT id, article_slug AS "articleSlug", name, message, created_at AS "createdAt" FROM comments WHERE article_slug = ${slug} ORDER BY created_at ASC`;
    return sendJson(response, 200, { comments: rows.map((row) => commentFromRow(row as Record<string, unknown>)) });
  }

  if (request.method !== "POST") return methodNotAllowed(response, ["GET", "POST"]);
  if (!ensureSameOrigin(request, response)) return;
  if (!sql) return sendJson(response, 503, { error: "Banco de dados ainda não configurado." });

  const body = readBody<{ slug?: unknown; name?: unknown; email?: unknown; message?: unknown; website?: unknown }>(request);

  // Campo-armadilha (honeypot): formulário real nunca preenche isso; só robôs de spam preenchem.
  if (typeof body.website === "string" && body.website.trim()) {
    return sendJson(response, 201, { comment: null });
  }

  const slug = normalizeSlug(body.slug);
  const input = normalizeComment(body);
  if (!slug || !input) return sendJson(response, 400, { error: "Preencha nome, e-mail válido e comentário." });

  await ensureSchema(sql);
  const id = randomUUID();
  const rows = await sql`INSERT INTO comments (id, article_slug, name, email, message, created_at)
    VALUES (${id}, ${slug}, ${input.name}, ${input.email}, ${input.message}, NOW())
    RETURNING id, article_slug AS "articleSlug", name, email, message, created_at AS "createdAt"`;
  return sendJson(response, 201, { comment: commentFromRow(rows[0] as Record<string, unknown>) });
}
