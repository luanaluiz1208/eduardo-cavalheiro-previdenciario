import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAdmin } from "../lib/auth";
import { methodNotAllowed, sendJson } from "../lib/http";

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "GET") return methodNotAllowed(response, ["GET"]);
  return sendJson(response, 200, { authenticated: isAdmin(request) });
}
