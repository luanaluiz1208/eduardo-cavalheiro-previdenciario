import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, Filter, Search } from "lucide-react";
import { Link } from "wouter";
import SiteShell from "@/components/SiteShell";
import { useBlogArticles } from "@/data/blog";

export default function Blog() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const articles = useBlogArticles();
  const categoryKey = (value: string) => value.trim().toLocaleLowerCase("pt-BR");
  const featured = articles[0];
  const categories = useMemo(() => ["Todos", ...Array.from(new Map(articles.map((article) => [categoryKey(article.category), article.category.trim()])).values())], [articles]);
  const quickTopics = ["Benefícios assistenciais", "Aposentadoria", "Benefícios por incapacidade", "Pensão por morte"];
  const filteredArticles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return articles.filter((article, index) => {
      if (index === 0) return false;
      const matchesCategory = category === "Todos" || categoryKey(article.category) === categoryKey(category);
      const searchable = `${article.title} ${article.excerpt} ${article.category}`.toLocaleLowerCase("pt-BR");
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [articles, category, search]);
  const paginatedArticles = filteredArticles.slice(0, visibleCount);

  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    setVisibleCount(9);
    window.setTimeout(() => document.getElementById("artigos")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  return (
    <SiteShell>
      <section className="blog-hero" aria-labelledby="blog-title">
        <div className="content-width blog-hero-grid">
          <div className="blog-hero-copy">
            <p className="eyebrow"><span /> Conteúdo informativo</p>
            <h1 id="blog-title">Providenciando a Previdência</h1>
            <p className="blog-hero-description">Informação clara sobre INSS, benefícios e aposentadorias para ajudar você a tomar decisões mais seguras.</p>
            <div className="blog-hero-actions">
              <a href="#artigos" className="button button-gold blog-hero-cta">Explorar artigos <ArrowUpRight size={17} /></a>
              <span className="blog-hero-note-inline">Atualizações sobre Direito Previdenciário</span>
            </div>
            <div className="blog-topic-shortcuts" aria-label="Atalhos por tema">
              <span>Encontre por tema</span>
              {quickTopics.map((topic) => <button type="button" key={topic} onClick={() => selectCategory(topic)}>{topic}</button>)}
            </div>
          </div>
        </div>
      </section>

      {featured ? <section className="content-width blog-featured-section" aria-labelledby="featured-title">
        <div className="section-kicker"><span>Leitura mais recente</span><span className="kicker-line" /></div>
        <Link href={`/blog/${featured.slug}`} className="blog-featured-card">
          <div className="blog-featured-copy">
            <div className="blog-featured-label"><span className="featured-dot" /> Artigo em destaque · publicado por último</div>
            <p className="article-category">{featured.category}</p>
            <h2 id="featured-title">{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <div className="blog-featured-meta"><span><CalendarDays size={15} /> {featured.date}</span><span><Clock3 size={15} /> {featured.readTime}</span></div>
            <span className="text-link">Ler artigo completo <ArrowUpRight size={17} /></span>
          </div>
          <div className="blog-featured-index" aria-hidden="true"><span>MAIS RECENTE</span><strong>01</strong><small>Uma leitura para começar</small></div>
        </Link>
      </section> : null}

      <section className="content-width blog-list-section" id="artigos" aria-labelledby="articles-title">
        <div className="blog-list-header">
          <div><p className="eyebrow"><span /> Arquivo de orientação</p><h2 id="articles-title">Encontre sua leitura</h2></div>
          <div className="blog-search-wrap">
            <Search size={17} aria-hidden="true" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(9); }} placeholder="Buscar por assunto..." aria-label="Buscar artigos" />
            {search ? <button type="button" onClick={() => setSearch("")} aria-label="Limpar busca">×</button> : null}
          </div>
        </div>
        <div className="category-filter" aria-label="Filtrar artigos por categoria">
          <Filter size={15} aria-hidden="true" />
          {categories.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => selectCategory(item)}>{item}</button>)}
        </div>
        {paginatedArticles.length ? <div className="blog-grid">
          {paginatedArticles.map((article, index) => (
            <Link href={`/blog/${article.slug}`} className="blog-card" key={article.slug}>
              <div className="blog-card-top"><span className="blog-card-number">{String(index + 2).padStart(2, "0")}</span><span className="blog-card-category">{article.category}</span></div>
              <div className="blog-card-content"><h3>{article.title}</h3><p>{article.excerpt}</p></div>
              <div className="blog-card-footer"><div className="blog-card-meta"><span><CalendarDays size={14} />{article.date}</span><span><Clock3 size={14} />{article.readTime}</span></div><span className="blog-card-arrow"><ArrowRight size={18} /></span></div>
            </Link>
          ))}
        </div> : <div className="blog-empty-state"><Search size={20} /><h3>Nenhum artigo encontrado</h3><p>Tente outra palavra ou escolha uma categoria para continuar a leitura.</p><button type="button" className="text-link" onClick={() => { setSearch(""); setCategory("Todos"); }}>Limpar filtros <ArrowRight size={16} /></button></div>}
        {filteredArticles.length > visibleCount ? <div className="blog-more-actions"><button type="button" onClick={() => setVisibleCount((current) => current + 9)} className="button button-navy blog-more-button">Ver mais artigos <ArrowUpRight size={16} /></button></div> : null}
      </section>

      <section className="blog-disclaimer"><div className="content-width blog-disclaimer-inner"><p className="eyebrow">Nota de leitura</p><p>Os textos têm caráter informativo e não substituem a análise individual do histórico contributivo, da documentação e da legislação aplicável.</p></div></section>
    </SiteShell>
  );
}
