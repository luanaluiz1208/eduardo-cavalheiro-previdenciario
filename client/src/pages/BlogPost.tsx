import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MessageCircle } from "lucide-react";
import { Link, useRoute } from "wouter";
import ArticleComments from "@/components/ArticleComments";
import SiteShell from "@/components/SiteShell";
import { useBlogArticles } from "@/data/blog";
import { useSiteContent } from "@/data/siteContent";
import { whatsappLink } from "@/data/areas";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const articles = useBlogArticles();
  const articleIndex = params?.slug ? articles.findIndex((item) => item.slug === params.slug) : -1;
  const article = articleIndex >= 0 ? articles[articleIndex] : undefined;
  const content = useSiteContent();

  if (!article) {
    return <SiteShell><section className="article-not-found content-width"><p className="eyebrow"><span /> Blog</p><h1>Artigo não encontrado.</h1><Link href="/blog" className="button button-gold">Voltar ao blog</Link></section></SiteShell>;
  }

  const readingSections = article.sections.slice(0, 4);
  const nextArticle = articles[articleIndex + 1];
  const previousArticle = articles[articleIndex - 1];

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
            <div className="article-reading-guide"><p className="eyebrow"><span /> Neste artigo você verá</p><ul>{readingSections.map((section) => <li key={section.heading}><Check size={15} />{section.heading}</li>)}</ul></div>
            {article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><div className="article-section-body" dangerouslySetInnerHTML={{ __html: section.body }} /></section>)}
            <div className="article-responsible-note"><strong>Importante</strong><p>As informações são gerais e podem mudar conforme a legislação, os documentos e o histórico de cada pessoa. Uma análise individual é necessária antes de qualquer decisão.</p></div>
            <div className="article-source"><p className="eyebrow"><span /> Referência consultada</p><a href={article.sourceUrl} target="_blank" rel="noreferrer">{article.sourceLabel} <ArrowUpRight size={15} /></a></div>
            <div className="article-next-nav">{previousArticle ? <Link href={`/blog/${previousArticle.slug}`}><small>Artigo mais recente</small><strong>{previousArticle.title}</strong><ArrowRight size={17} /></Link> : <span />}{nextArticle ? <Link href={`/blog/${nextArticle.slug}`}><small>Próximo artigo</small><strong>{nextArticle.title}</strong><ArrowRight size={17} /></Link> : <span />}</div>
            <ArticleComments slug={article.slug} />
          </div>
          <aside className="article-aside"><div className="article-aside-card"><span className="note-index">ORIENTAÇÃO INDIVIDUAL</span><h2>Seu histórico merece uma leitura cuidadosa.</h2><p>Se você precisa organizar documentos ou entender uma possibilidade previdenciária, fale diretamente com o escritório.</p><a href={whatsappLink("Olá, Eduardo. Li um artigo no blog e gostaria de orientação previdenciária.", content.whatsapp)} target="_blank" rel="noreferrer" className="button button-gold"><MessageCircle size={17} /> Falar no WhatsApp</a></div></aside>
        </div>
      </article>
    </SiteShell>
  );
}
