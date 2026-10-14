/**
 * Direção visual: páginas de serviço como dossiês de orientação — leitura em etapas, contraste sóbrio e CTA sempre presente.
 * Conteúdo: informativo, com requisitos gerais e alerta de análise individual para não induzir promessa de concessão.
 */

import { ArrowLeft, ArrowRight, Check, MessageCircle, Scale, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import SiteShell from "@/components/SiteShell";
import { whatsappLink } from "@/data/areas";
import { useHomeContent, useSiteContent } from "@/data/siteContent";

export default function AreaDetail() {
  const params = useParams<{ slug: string }>();
  const home = useHomeContent();
  const site = useSiteContent();
  const area = home.areas.find((item) => item.slug === params.slug);

  if (!area) {
    return (
      <SiteShell>
        <section className="detail-not-found">
          <div className="content-width"><p className="eyebrow">Página não encontrada</p><h1>Não localizamos esta área de atuação.</h1><Link href="/" className="button button-navy"><ArrowLeft size={18} /> Voltar para o início</Link></div>
        </section>
      </SiteShell>
    );
  }

  const contactMessage = `Olá, Eduardo. Gostaria de entender melhor sobre ${area.title}.`;

  return (
    <SiteShell>
      <section className="detail-hero" data-area={area.number}>
        <div className="detail-watermark" aria-hidden="true">{area.number}</div>
        <div className="content-width detail-hero-content">
          <Link href="/" className="back-link"><ArrowLeft size={17} aria-hidden="true" /> Voltar ao início</Link>
          <p className="eyebrow gold-eyebrow">Área de atuação {area.number}</p>
          <p className="detail-file-tag">Dossiê previdenciário · {area.shortTitle}</p>
          <h1>{area.title}</h1>
          <p>{area.summary}</p>
          <div className="detail-hero-actions">
            <a className="button button-gold" href={whatsappLink(contactMessage, site.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" /> Falar sobre esta área</a>
            <a href="#requisitos" className="text-link light-link">Ver informações gerais <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="detail-content-section" id="requisitos">
        <div className="content-width detail-layout">
          <aside className="detail-aside">
            <p>Leitura orientativa</p>
            <a href="#quem-tem-direito">Quem pode ter direito</a>
            <a href="#requisitos-gerais">Requisitos gerais</a>
            <a href="#como-auxiliamos">Como podemos auxiliar</a>
            <a className="aside-contact" href={whatsappLink(contactMessage, site.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> Tirar uma dúvida</a>
          </aside>

          <div className="detail-main">
            <article className="detail-block" id="quem-tem-direito">
              <div className="detail-icon"><Scale size={24} strokeWidth={1.5} aria-hidden="true" /></div>
              <p className="eyebrow">Quem pode ter direito</p>
              <h2>O ponto de partida é entender se a sua história se encaixa na proteção prevista.</h2>
              <p className="detail-lead">{area.who}</p>
            </article>

            <article className="detail-block requirements-block" id="requisitos-gerais">
              <p className="eyebrow">Requisitos gerais</p>
              <h2>O que normalmente é analisado</h2>
              <ul className="requirements-list">
                {area.requirements.map((requirement) => <li key={requirement}><span><Check size={15} aria-hidden="true" /></span>{requirement}</li>)}
              </ul>
              <p className="detail-warning">As exigências podem variar conforme a data dos fatos, a categoria do segurado, o histórico de contribuições e as regras de transição. A lista acima não substitui avaliação individual.</p>
            </article>

            <article className="detail-block support-block" id="como-auxiliamos">
              <div className="detail-icon"><ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" /></div>
              <p className="eyebrow">Como um advogado pode auxiliar</p>
              <h2>Documentos bem organizados e uma rota compreensível fazem diferença.</h2>
              <p className="detail-lead">{area.support}</p>
              <a href={whatsappLink(contactMessage, site.whatsapp)} className="button button-navy" target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" /> Solicitar orientação</a>
            </article>

          </div>
        </div>
      </section>

      <section className="detail-cta">
        <div className="content-width detail-cta-content">
          <div><p className="eyebrow gold-eyebrow">Próximo passo</p><h2>Tem uma dúvida sobre {area.shortTitle.toLowerCase()}?</h2><p>Envie uma mensagem e explique brevemente sua situação. O contato inicial é o primeiro passo para compreender as possibilidades do seu caso.</p></div>
          <a className="button button-gold" href={whatsappLink(contactMessage, site.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={19} aria-hidden="true" /> Falar no WhatsApp</a>
        </div>
      </section>
    </SiteShell>
  );
}
