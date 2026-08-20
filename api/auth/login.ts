import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loginMatches, startAdminSession } from "../lib/auth";
import { ensureSameOrigin, methodNotAllowed, readBody, sendJson } from "../lib/http";

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") return methodNotAllowed(response, ["POST"]);
  if (!ensureSameOrigin(request, response)) return;

  const { email, password } = readBody<{ email?: string; password?: string }>(request);
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return sendJson(response, 503, { error: "O acesso administrativo ainda precisa ser configurado nas variáveis de ambiente da Vercel." });
  }
  if (!loginMatches(email || "", password || "")) return sendJson(response, 401, { error: "E-mail ou senha inválidos." });

  startAdminSession(response);
  return sendJson(response, 200, { authenticated: true });
}
