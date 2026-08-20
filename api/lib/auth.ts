import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "ec_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  role: "admin";
  expiresAt: number;
};

function secret() {
  return process.env.SESSION_SECRET || "";
}

function encode(payload: SessionPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function decode(value: string | undefined): SessionPayload | null {
  if (!value || !secret()) return null;
  const [encoded, suppliedSignature] = value.split(".");
  if (!encoded || !suppliedSignature) return null;

  const expectedSignature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.role === "admin" && payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

function cookieValue(request: VercelRequest, name: string) {
  const source = request.headers.cookie || "";
  return source.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

function writeCookie(response: VercelResponse, value: string, maxAge: number) {
  const secure = process.env.VERCEL ? "; Secure" : "";
  response.setHeader("Set-Cookie", `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`);
}

export function isAdmin(request: VercelRequest) {
  return Boolean(decode(cookieValue(request, COOKIE_NAME)));
}

export function startAdminSession(response: VercelResponse) {
  if (!secret()) throw new Error("SESSION_SECRET não configurado.");
  writeCookie(response, encode({ role: "admin", expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000 }), SESSION_DURATION_SECONDS);
}

export function endAdminSession(response: VercelResponse) {
  writeCookie(response, "", 0);
}

export function passwordsMatch(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return Boolean(expected) && left.length === right.length && timingSafeEqual(left, right);
}

export function loginMatches(email: string, password: string) {
  return email.trim().toLowerCase() === (process.env.ADMIN_EMAIL || "").trim().toLowerCase() && passwordsMatch(password);
}
