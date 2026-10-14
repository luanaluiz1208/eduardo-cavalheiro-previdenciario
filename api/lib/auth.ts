import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { database, ensureSchema } from "./database.js";

const COOKIE_NAME = "ec_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

type SessionPayload = { role: "admin"; expiresAt: number };
function secret() { return process.env.SESSION_SECRET || ""; }
function encode(payload: SessionPayload) { const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url"); const signature = createHmac("sha256", secret()).update(encoded).digest("base64url"); return `${encoded}.${signature}`; }
function decode(value: string | undefined): SessionPayload | null {
  if (!value || !secret()) return null;
  const [encoded, suppliedSignature] = value.split(".");
  if (!encoded || !suppliedSignature) return null;
  const expectedSignature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const supplied = Buffer.from(suppliedSignature); const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try { const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload; return payload.role === "admin" && payload.expiresAt > Date.now() ? payload : null; } catch { return null; }
}
function cookieValue(request: VercelRequest, name: string) { return (request.headers.cookie || "").split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1); }
function writeCookie(response: VercelResponse, value: string, maxAge: number) { const secure = process.env.VERCEL ? "; Secure" : ""; response.setHeader("Set-Cookie", `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`); }
export function isAdmin(request: VercelRequest) { return Boolean(decode(cookieValue(request, COOKIE_NAME))); }
export function startAdminSession(response: VercelResponse) { if (!secret()) throw new Error("SESSION_SECRET não configurado."); writeCookie(response, encode({ role: "admin", expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000 }), SESSION_DURATION_SECONDS); }
export function endAdminSession(response: VercelResponse) { writeCookie(response, "", 0); }
export function passwordHash(password: string) { const salt = randomBytes(16).toString("hex"); const derived = scryptSync(password, salt, 64).toString("hex"); return `scrypt:${salt}:${derived}`; }
export function passwordHashMatches(candidate: string, stored: string) { const [, salt, expectedHex] = stored.split(":"); if (!salt || !expectedHex) return false; const actual = scryptSync(candidate, salt, 64); const expected = Buffer.from(expectedHex, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }
export function passwordsMatch(candidate: string) { const expected = process.env.ADMIN_PASSWORD || ""; const left = Buffer.from(candidate); const right = Buffer.from(expected); return Boolean(expected) && left.length === right.length && timingSafeEqual(left, right); }

export async function loginMatches(email: string, password: string) {
  if (email.trim().toLowerCase() !== (process.env.ADMIN_EMAIL || "").trim().toLowerCase()) return false;
  const sql = database();
  if (sql) {
    try {
      await ensureSchema(sql);
      const rows = await sql`SELECT password_hash FROM admin_password_overrides WHERE id = 1 LIMIT 1`;
      const stored = rows[0] && String((rows[0] as { password_hash?: string }).password_hash || "");
      if (stored) return passwordHashMatches(password, stored);
    } catch { /* fallback to the configured environment password */ }
  }
  return passwordsMatch(password);
}

export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function newResetToken() { return randomBytes(32).toString("base64url"); }
