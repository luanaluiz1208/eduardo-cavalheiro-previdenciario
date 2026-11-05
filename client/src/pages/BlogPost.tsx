import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import ArticleComments from "@/components/ArticleComments";
import SiteShell from "@/components/SiteShell";
import { useBlogArticles } from "@/data/blog";

function sectionId(heading: string, index: number) {
  const normalized = heading.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `assunto-${index + 1}-${normalized || "secao"}`;
}

type TocItem = { label: string; id: string; level: number };

function plainHeading(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function isContentHeading(tag: string, inner: string, label: string) {
  if (!label || /<(ul|ol|img|a)\b/i.test(inner)) return false;
  if (tag.toLowerCase().startsWith("h")) return true;
  const strongMatch = inner.match(/<strong(?:\s[^>]*)?>([\s\S]*?)<\/strong>/i);
  const strongLabel = strongMatch ? plainHeading(strongMatch[1]) : "";
  const isStrongOnly = Boolean(strongLabel) && strongLabel === label;
  const isShortQuestion = label.length <= 120 && /[?:]$/.test(label);
  return isStrongOnly || isShortQuestion;
}

function headingsFromHtml(html: string, sectionIndex: number) {
  const headings: TocItem[] = [];
  const pattern = /<(h[2-6]|p)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  let headingIndex = 0;
  while ((match = pattern.exec(html))) {
    const label = plainHeading(match[2]);
    if (!isContentHeading(match[1], match[2], label)) continue;
    headings.push({ label, id: `assunto-${sectionIndex + 1}-sub-${headingIndex + 1}`, level: match[1].startsWith("h") ? Number(match[1].slice(1)) : 3 });
    headingIndex += 1;
  }
  return headings;
}

function addHeadingIds(html: string, sectionIndex: number) {
  let headingIndex = 0;
  return html.replace(/<(h[2-6]|p)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/gi, (full, tag, attributes, inner) => {
    const label = plainHeading(inner);
    if (!isContentHeading(tag, inner, label)) return full;
    headingIndex += 1;
    const withoutId = String(attributes).replace(/\s+id=(?:"[^"]*"|'[^']*')/i, "");
    return `<${tag}${withoutId} id="assunto-${sectionIndex + 1}-sub-${headingIndex}">${inner}</${tag}>`;
  });
}

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const articles = useBlogArticles();
  const articleIndex = params?.slug ? articles.findIndex((item) => item.slug === params.slug) : -1;
  const article = articleIndex >= 0 ? articles[articleIndex] : undefined;

  if (!article) {
    return <SiteShell><section className="article-not-found content-width"><p className="eyebrow"><span /> Blog</p><h1>Artigo não encontrado.</h1><Link href="/blog" className="button button-gold">Voltar ao blog</Link></section></SiteShell>;
  }

  const nextArticle = articles[articleIndex + 1];
  const previousArticle = articles[articleIndex - 1];
  const tocItems: TocItem[] = article.sections.flatMap((section, index) => headingsFromHtml(section.body, index));
  const [activeTopic, setActiveTopic] = useState(tocItems[0]?.id || "");

  useEffect(() => {
    if (!tocItems.length) return;
    setActiveTopic(tocItems[0].id);
    const elements = tocItems.map((item) => document.getElementById(item.id)).filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);
      if (visible[0]) setActiveTopic((visible[0].target as HTMLElement).id);
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 1] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [article.slug, tocItems.map((item) => item.id).join("|")]);

  return (
    <SiteShell>
      <article className="article-page">
        <header className="article-header">
          <div className="content-width article-header-inner">
            <Link href="/blog" className="back-link"><ArrowLeft size={16} /> Voltar ao blog</Link>
            <div className="article-header-kicker"><p className="article-category">{article.category}</p><span className="article-status">Conteúdo informativo</span></div>
            <h1>{article.title}</h1>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta"><span><CalendarDays size={15} />{article.date}</span><span><Clock3 size={15} />{article.readTime}</span><span>Por Eduardo Ferreira Cavalheiro</span></div>
          </div>
        </header>
        <div className="content-width article-layout">
          <div className="article-body">
            <div className="article-author-note"><div className="article-author-mark">EC</div><div><strong>Eduardo Ferreira Cavalheiro</strong><span>Advogado Previdenciarista · OAB/RJ nº 26.639/23</span></div></div>
            {article.sections.map((section, index) => <section id={sectionId(section.heading, index)} key={`${section.heading}-${index}`}><h2>{section.heading}</h2><div className="article-section-body" dangerouslySetInnerHTML={{ __html: addHeadingIds(section.body, index) }} /></section>)}
            <div className="article-responsible-note"><strong>Importante</strong><p>As informações são gerais e podem mudar conforme a legislação, os documentos e o histórico de cada pessoa. Uma análise individual é necessária antes de qualquer decisão.</p></div>
            <div className="article-source"><p className="eyebrow"><span /> Referência consultada</p><a href={article.sourceUrl} target="_blank" rel="noreferrer">{article.sourceLabel} <ArrowUpRight size={15} /></a></div>
            <div className="article-next-nav">{previousArticle ? <Link href={`/blog/${previousArticle.slug}`}><small>Artigo mais recente</small><strong>{previousArticle.title}</strong><ArrowRight size={17} /></Link> : <span />}{nextArticle ? <Link href={`/blog/${nextArticle.slug}`}><small>Próximo artigo</small><strong>{nextArticle.title}</strong><ArrowRight size={17} /></Link> : <span />}</div>
            <ArticleComments slug={article.slug} />
          </div>
          <aside className="article-aside">
            <div className="article-aside-card article-index-card">
              <span className="note-index">NESTE POST</span>
              <h2>Assuntos tratados</h2>
              <nav className="article-index" aria-label="Assuntos tratados neste artigo">
                <ol>{tocItems.map((item, index) => <li className={`${item.level > 2 ? "article-index-subitem " : ""}${activeTopic === item.id ? "is-active" : ""}`} key={`${item.id}-${index}`}><a href={`#${item.id}`} aria-current={activeTopic === item.id ? "location" : undefined} onClick={() => setActiveTopic(item.id)}>{item.label}</a></li>)}</ol>
              </nav>
            </div>
          </aside>
        </div>
      </article>
    </SiteShell>
  );
}
