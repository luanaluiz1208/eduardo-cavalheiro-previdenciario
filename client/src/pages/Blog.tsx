import { useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, Filter } from "lucide-react";
import { Link } from "wouter";
import SiteShell from "@/components/SiteShell";
import { useBlogArticles } from "@/data/blog";

export default function Blog() {
  const [category, setCategory] = useState("Todos");
  const articles = useBlogArticles();
  const categories = useMemo(() => ["Todos", ...Array.from(new Set(articles.map((article) => article.category)))], [articles]);
  const visibleArticles = useMemo(() => category === "Todos" ? articles : articles.filter((article) => article.category === category), [articles, category]);
  const featured = articles.find((article) => article.featured) ?? articles[0];

  return (
    <SiteShell>
      <section className="blog-hero">
        <div className="content-width blog-hero-grid">
          <div>
            <p className="eyebrow"><span /> Blog previdenciário</p>
            <h1>Providenciando a Previdência.</h1>
            <p className="blog-hero-lead">Artigos objetivos sobre Previdência Social, benefícios do INSS e organização documental para quem precisa tomar decisões com mais clareza.</p>
          </div>
          <div className="blog-hero-note">
            <span className="note-index">01 / CADERNO</span>
            <p>Conteúdo informativo, escrito em linguagem acessível e acompanhado de referências oficiais.</p>
            <a href="#artigos">Explorar artigos <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </section>

      {featured ? <section className="content-width blog-featured-section" aria-labelledby="featured-title">
        <div className="section-kicker"><span>Leitura em destaque</span><span className="kicker-line" /></div>
        <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
          <div className="blog-featured-copy">
            <p className="article-category">{featured.category}</p>
            <h2 id="featured-title">{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <span className="text-link">Ler artigo completo <ArrowUpRight size={17} /></span>
          </div>
          <div className="blog-featured-index"><span>ARTIGO</span><strong>01</strong><small>{featured.date}</small></div>
        </Link>
      </section> : null}

      <section className="content-width blog-list-section" id="artigos" aria-labelledby="articles-title">
        <div className="blog-list-header">
          <div><p className="eyebrow"><span /> Arquivo de orientação</p><h2 id="articles-title">Artigos recentes</h2></div>
          <div className="category-filter" aria-label="Filtrar artigos por categoria">
            <Filter size={15} aria-hidden="true" />
            {categories.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </div>
        <div className="blog-grid">
          {visibleArticles.map((article, index) => (
            <Link href={`/blog/${article.slug}`} className="blog-card" key={article.slug}>
              <div className="blog-card-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{article.category}</span></div>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <div className="blog-card-meta"><span><CalendarDays size={14} />{article.date}</span><span><Clock3 size={14} />{article.readTime}</span></div>
              <span className="blog-card-arrow"><ArrowUpRight size={18} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="blog-disclaimer">
        <div className="content-width blog-disclaimer-inner">
          <p className="eyebrow"><span /> Nota editorial</p>
          <p>As publicações são informativas e não substituem a análise individual de documentos e histórico previdenciário. Regras e procedimentos podem ser atualizados pelos órgãos oficiais.</p>
        </div>
      </section>
    </SiteShell>
  );
}
