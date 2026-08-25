import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_request: VercelRequest, response: VercelResponse) {
  const body = `User-agent: *\nAllow: /\n\nSitemap: https://adveduardocavalheiro.com.br/sitemap.xml\n`;
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600");
  response.status(200).send(body);
}
