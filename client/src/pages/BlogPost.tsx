import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MessageCircle } from "lucide-react";
import { Link, useRoute } from "wouter";
import SiteShell from "@/components/SiteShell";
import { useBlogArticles } from "@/data/blog";
import { useSiteContent } from "@/data/siteContent";
import { whatsappLink } from "@/data/areas";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const articles = useBlogArticles();
  const article = params?.slug ? articles.find((item) => item.slug === params.slug) : undefined;
  const content = useSiteContent();

  if (!article) {
    return <SiteShell><section className="article-not-found content-width"><p className="eyebrow"><span /> Blog</p><h1>Artigo não encontrado.</h1><Link href="/blog" className="button button-gold">Voltar ao blog</Link></section></SiteShell>;
  }

  return (
    <SiteShell>
      <article className="article-page">
        <header className="article-header">
          <div className="content-width article-header-inner">
            <Link href="/blog" className="back-link"><ArrowLeft size={16} /> Voltar ao blog</Link>
            <p className="article-category">{article.category}</p>
            <h1>{article.title}</h1>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-meta"><span><CalendarDays size={15} />{article.date}</span><span><Clock3 size={15} />{article.readTime}</span></div>
          </div>
        </header>
        <div className="content-width article-layout">
          <div className="article-body">
            {article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
            <div className="article-source"><p className="eyebrow"><span /> Referência consultada</p><a href={article.sourceUrl} target="_blank" rel="noreferrer">{article.sourceLabel} <ArrowUpRight size={15} /></a></div>
          </div>
          <aside className="article-aside"><div className="article-aside-card"><span className="note-index">ORIENTAÇÃO INDIVIDUAL</span><h2>Seu histórico merece uma leitura cuidadosa.</h2><p>Se você precisa organizar documentos ou entender uma possibilidade previdenciária, fale diretamente com o escritório.</p><a href={whatsappLink("Olá, Eduardo. Li um artigo no blog e gostaria de orientação previdenciária.", content.whatsapp)} target="_blank" rel="noreferrer" className="button button-gold"><MessageCircle size={17} /> Falar no WhatsApp</a></div></aside>
        </div>
      </article>
    </SiteShell>
  );
}
