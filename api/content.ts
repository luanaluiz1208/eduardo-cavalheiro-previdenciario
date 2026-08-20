import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdmin } from "./lib/auth";
import { ContentKey, database, ensureSchema } from "./lib/database";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "./lib/http";

const allowedKeys: ContentKey[] = ["heroTitle", "heroDescription", "officeAddress", "officeHours", "whatsapp", "email", "instagram", "tiktok"];

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const sql = database();
  if (request.method === "GET") {
    if (!sql) return sendJson(response, 200, { content: {} });
    await ensureSchema(sql);
    const rows = await sql`SELECT content_key AS "contentKey", value FROM site_content`;
    return sendJson(response, 200, { content: Object.fromEntries(rows.map((row) => [String(row.contentKey), String(row.value)])) });
  }

  if (request.method !== "PUT") return methodNotAllowed(response, ["GET", "PUT"]);
  if (!ensureSameOrigin(request, response)) return;
  if (!isAdmin(request)) return sendJson(response, 401, { error: "Acesso administrativo necessário." });
  if (!sql) return sendJson(response, 503, { error: "Banco de dados ainda não configurado." });

  const { content } = readBody<{ content?: Record<string, unknown> }>(request);
  if (!content || typeof content !== "object") return sendJson(response, 400, { error: "Dados institucionais inválidos." });
  await ensureSchema(sql);
  for (const key of allowedKeys) {
    const value = content[key];
    if (typeof value !== "string" || value.length > 5000) return sendJson(response, 400, { error: "Um campo institucional é inválido." });
    await sql`INSERT INTO site_content (content_key, value, updated_at) VALUES (${key}, ${value.trim()}, NOW()) ON CONFLICT (content_key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`;
  }
  return sendJson(response, 200, { saved: true });
}
