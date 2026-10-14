import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "../lib/http.js";
import { database, ensureSchema } from "../lib/database.js";
import { newResetToken, tokenHash } from "../lib/auth.js";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
  if (!ensureSameOrigin(request, response)) return;
  const { email } = readBody<{ email?: string }>(request);
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const generic = { message: "Se o e-mail informado for o e-mail administrativo, enviaremos as instruções de recuperação." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return sendJson(response, 200, generic);
  if (normalizedEmail !== (process.env.ADMIN_EMAIL || "").trim().toLowerCase()) return sendJson(response, 200, generic);
  const sql = database();
  const resendKey = process.env.RESEND_API_KEY;
  if (!sql || !resendKey) return sendJson(response, 200, generic);
  try {
    await ensureSchema(sql);
    await sql`DELETE FROM admin_password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL`;
    const token = newResetToken();
    await sql`INSERT INTO admin_password_reset_tokens (id, token_hash, email, expires_at) VALUES (${randomUUID()}, ${tokenHash(token)}, ${normalizedEmail}, NOW() + INTERVAL '30 minutes')`;
    const protocol = request.headers["x-forwarded-proto"] || "https";
    const host = request.headers["x-forwarded-host"] || request.headers.host;
    const resetUrl = `${protocol}://${host}/admin/reset-password?token=${encodeURIComponent(token)}`;
    const from = process.env.COMMENT_FROM_EMAIL || "adv@eduardocavalheiro.com";
    const emailResponse = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [normalizedEmail], subject: "Recuperação de acesso ao painel", text: `Olá.\n\nRecebemos uma solicitação para redefinir a senha do painel administrativo.\n\nAcesse este link para criar uma nova senha (válido por 30 minutos e uma única vez):\n${resetUrl}\n\nSe você não fez esta solicitação, ignore esta mensagem.` }) });
    if (!emailResponse.ok) return sendJson(response, 200, generic);
  } catch { return sendJson(response, 200, generic); }
  return sendJson(response, 200, generic);
}
