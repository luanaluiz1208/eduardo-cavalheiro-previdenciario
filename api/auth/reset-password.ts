import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "../lib/http.js";
import { database, ensureSchema } from "../lib/database.js";
import { passwordHash, tokenHash } from "../lib/auth.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
  if (!ensureSameOrigin(request, response)) return;
  const { token, password } = readBody<{ token?: string; password?: string }>(request);
  if (typeof token !== "string" || token.length < 20 || typeof password !== "string" || password.length < 10) return sendJson(response, 400, { error: "Informe um token válido e uma senha com pelo menos 10 caracteres." });
  const sql = database();
  if (!sql) return sendJson(response, 503, { error: "A recuperação de senha ainda precisa do banco de dados configurado." });
  try {
    await ensureSchema(sql);
    const rows = await sql`SELECT id, email FROM admin_password_reset_tokens WHERE token_hash = ${tokenHash(token)} AND used_at IS NULL AND expires_at > NOW() LIMIT 1`;
    const reset = rows[0] as { id?: string; email?: string } | undefined;
    if (!reset?.id || String(reset.email).toLowerCase() !== (process.env.ADMIN_EMAIL || "").trim().toLowerCase()) return sendJson(response, 400, { error: "Este link é inválido, expirou ou já foi utilizado." });
    await sql`INSERT INTO admin_password_overrides (id, password_hash) VALUES (1, ${passwordHash(password)}) ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()`;
    await sql`UPDATE admin_password_reset_tokens SET used_at = NOW() WHERE id = ${reset.id}`;
    return sendJson(response, 200, { reset: true });
  } catch { return sendJson(response, 500, { error: "Não foi possível redefinir a senha agora. Tente novamente." }); }
}
