import type { VercelRequest, VercelResponse } from "@vercel/node";
import { database, ensureSchema, fromRow } from "./lib/database.js";

const SITE_URL = "https://adveduardocavalheiro.com.br";

export default async function handler(_request: VercelRequest, response: VercelResponse) {
  const staticUrls = ["", "/blog"];
  let articleUrls: string[] = [];

  const sql = database();
  if (sql) {
    await ensureSchema(sql);
    const rows = await sql`SELECT id, slug, category, title, excerpt, read_time AS "readTime", published_date AS date, featured, published, sections, source_label AS "sourceLabel", source_url AS "sourceUrl" FROM articles WHERE published = true ORDER BY updated_at DESC`;
    articleUrls = rows.map((row) => `/blog/${fromRow(row as Record<string, unknown>).slug}`);
  }

  const urls = [...staticUrls, ...articleUrls];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
    .join("\n")}\n</urlset>\n`;

  response.setHeader("Content-Type", "application/xml; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=3600");
  response.status(200).send(body);
}
