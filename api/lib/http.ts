import type { VercelRequest, VercelResponse } from "@vercel/node";

export function sendJson(response: VercelResponse, status: number, body: unknown) {
  response.status(status).setHeader("Content-Type", "application/json; charset=utf-8").send(JSON.stringify(body));
}

export function methodNotAllowed(response: VercelResponse, allowed: string[]) {
  response.setHeader("Allow", allowed.join(", "));
  sendJson(response, 405, { error: "Método não permitido." });
}

export function readBody<T>(request: VercelRequest): T {
  if (!request.body) return {} as T;
  if (typeof request.body === "string") return JSON.parse(request.body) as T;
  return request.body as T;
}

export function ensureSameOrigin(request: VercelRequest, response: VercelResponse) {
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (!origin || !host) return true;

  try {
    if (new URL(origin).host === host) return true;
  } catch {
    // A origem inválida é recusada abaixo.
  }

  sendJson(response, 403, { error: "Origem da solicitação não autorizada." });
  return false;
}
