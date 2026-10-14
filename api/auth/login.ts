import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { loginMatches, newResetToken, passwordHash, startAdminSession, tokenHash } from "../lib/auth.js";
import { database, ensureSchema } from "../lib/database.js";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "../lib/http.js";

const genericRecoveryMessage = "Se o e-mail informado for o e-mail administrativo, enviaremos as instruções de recuperação.";

async function forgotPassword(request: VercelRequest, response: VercelResponse, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail !== (process.env.ADMIN_EMAIL || "").trim().toLowerCase()) return sendJson(response, 200, { message: genericRecoveryMessage });
  const sql = database(); const resendKey = process.env.RESEND_API_KEY;
  if (!sql || !resendKey) return sendJson(response, 200, { message: genericRecoveryMessage });
  try {
    await ensureSchema(sql);
    await sql`DELETE FROM admin_password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL`;
    const token = newResetToken();
    await sql`INSERT INTO admin_password_reset_tokens (id, token_hash, email, expires_at) VALUES (${randomUUID()}, ${tokenHash(token)}, ${normalizedEmail}, NOW() + INTERVAL '30 minutes')`;
    const protocol = request.headers["x-forwarded-proto"] || "https"; const host = request.headers["x-forwarded-host"] || request.headers.host;
    const resetUrl = `${protocol}://${host}/admin/reset-password?token=${encodeURIComponent(token)}`;
    const from = process.env.COMMENT_FROM_EMAIL || "adv@eduardocavalheiro.com";
    const emailResponse = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [normalizedEmail], subject: "Recuperação de acesso ao painel", text: `Olá.\n\nRecebemos uma solicitação para redefinir a senha do painel administrativo.\n\nAcesse este link para criar uma nova senha (válido por 30 minutos e uma única vez):\n${resetUrl}\n\nSe você não fez esta solicitação, ignore esta mensagem.` }) });
    if (!emailResponse.ok) return sendJson(response, 200, { message: genericRecoveryMessage });
  } catch { return sendJson(response, 200, { message: genericRecoveryMessage }); }
  return sendJson(response, 200, { message: genericRecoveryMessage });
}

async function resetPassword(response: VercelResponse, token: string, password: string) {
  if (token.length < 20 || password.length < 10) return sendJson(response, 400, { error: "Informe um token válido e uma senha com pelo menos 10 caracteres." });
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

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
  if (!ensureSameOrigin(request, response)) return;
  const body = readBody<{ action?: string; email?: string; password?: string; token?: string }>(request);
  if (body.action === "forgot-password") return forgotPassword(request, response, body.email || "");
  if (body.action === "reset-password") return resetPassword(response, body.token || "", body.password || "");
  const { email, password } = body;
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) return sendJson(response, 503, { error: "O acesso administrativo ainda precisa ser configurado nas variáveis de ambiente da Vercel." });
  if (!(await loginMatches(email || "", password || ""))) return sendJson(response, 401, { error: "E-mail ou senha inválidos." });
  startAdminSession(response);
  return sendJson(response, 200, { authenticated: true });
}
