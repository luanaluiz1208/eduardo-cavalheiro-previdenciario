/**
 * Direção visual: Arquivo de Confiança — composição editorial assimétrica, azul-marinho profundo e dourado de arquivo.
 * Objetivo da página: transformar uma dúvida previdenciária em um próximo passo claro de contato, sem promessas de resultado.
 */

import { FormEvent, useState, type ComponentType } from "react";
import { Link } from "wouter";
import {
  Accessibility, Activity, ArrowDownRight, ArrowRight, Baby, BadgeCheck, BookOpen,
  Building2, CalendarDays, Check, Compass, FileCheck2, FileClock, Gavel, GraduationCap,
  HandHeart, HeartPulse, Instagram, LockKeyhole, Mail, MapPin, MessageCircle,
  Phone, Quote, RefreshCcw, Route, Scale, Send, ShieldCheck, UsersRound, Wheat,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteShell from "@/components/SiteShell";
import { type AreaIcon, whatsappLink } from "@/data/areas";
import { mapsDirectionsLink, mapsSearchLink, useHomeContent, useSiteContent, useSiteImages } from "@/data/siteContent";

const iconMap: Record<AreaIcon, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  calendar: CalendarDays,
  route: Route,
  shield: ShieldCheck,
  compass: Compass,
  pulse: HeartPulse,
  badge: BadgeCheck,
  activity: Activity,
  hand: HandHeart,
  baby: Baby,
  family: UsersRound,
  wheat: Wheat,
  refresh: RefreshCcw,
  accessibility: Accessibility,
  graduation: GraduationCap,
  lock: LockKeyhole,
  fileClock: FileClock,
  building: Building2,
  scale: Scale,
  gavel: Gavel,
};



export default function Home() {
  const content = useSiteContent();
  const home = useHomeContent();
  const images = useSiteImages();
  const officeAddress = content.officeAddress;
  const officeMapsLink = mapsSearchLink(officeAddress);
  const officeDirectionsLink = mapsDirectionsLink(officeAddress);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sentMessage, setSentMessage] = useState("");

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = `Olá, Eduardo. Meu nome é ${form.name || ""}.\n\nAssunto: ${form.subject || "Não informado"}\nTelefone: ${form.phone || "Não informado"}\nE-mail: ${form.email || "Não informado"}\n\nMensagem: ${form.message || "Gostaria de receber orientação sobre meu caso previdenciário."}`;
    window.open(whatsappLink(text, content.whatsapp), "_blank", "noopener,noreferrer");
    setSentMessage("Abrimos o WhatsApp com o resumo do seu contato. Se preferir, envie a mensagem diretamente por lá.");
  };

  return (
    <SiteShell>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-background" style={{ backgroundImage: `linear-gradient(90deg, rgba(11,31,58,0.98) 0%, rgba(11,31,58,0.93) 47%, rgba(11,31,58,0.66) 100%), url('${images.heroBackground}')` }} />
        <div className="hero-journey-rail" aria-hidden="true"><span>01</span><i /></div>
        <div className="content-width hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span /> {home.heroKicker}</div>
            <h1 id="hero-title">{content.heroTitle}</h1>
            <p>{content.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-gold" href={whatsappLink("Olá, Eduardo. Quero entender melhor a minha situação previdenciária.", content.whatsapp)} target="_blank" rel="noreferrer">
                <MessageCircle size={19} aria-hidden="true" /> {home.heroPrimaryCta}
              </a>
              <a className="text-link light-link" href="#areas">{home.heroSecondaryCta} <ArrowDownRight size={18} aria-hidden="true" /></a>
            </div>
            <div className="hero-notes">
              {home.heroNotes.filter((note) => note.trim()).map((note) => <span key={note}><Check size={15} aria-hidden="true" /> {note}</span>)}
            </div>
          </div>

          <div className="hero-portrait-wrap" aria-label="Eduardo Ferreira Cavalheiro">
            <div className="portrait-index" aria-hidden="true">EC<br /><span>26.639/23</span></div>
            <div className="portrait-frame">
              <img src={images.heroPortrait} alt="Eduardo Ferreira Cavalheiro" className="hero-portrait" />
              <div className="portrait-caption"><span>Eduardo Ferreira Cavalheiro</span><small>Advogado Previdenciarista · OAB/RJ nº 26.639/23</small></div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="section section-paper about-section traced-section">
        <div className="content-width offset-grid">
          <div className="section-intro narrow-intro about-photo" aria-label="Eduardo Ferreira Cavalheiro em apresentação profissional">
            <img src={images.aboutPortrait} alt="Eduardo Ferreira Cavalheiro" />
          </div>
          <div className="about-copy">
            <h2 className="about-name">{home.aboutName}</h2>
            <p className="lead-copy">{home.aboutLead}</p>
            <p>{home.aboutBody}</p>
            <div className="about-signature">
              <span className="signature-line" />
              <div><strong>Eduardo Ferreira Cavalheiro</strong><small>Advogado Previdenciarista · OAB/RJ nº 26.639/23</small></div>
            </div>
            <a className="text-link dark-link" href={whatsappLink("Olá, Eduardo. Gostaria de agendar uma conversa sobre Direito Previdenciário.", content.whatsapp)} target="_blank" rel="noreferrer">{home.aboutCta} <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="section proof-section traced-section">
        <div className="content-width proof-grid">
          <div className="proof-copy">
            <p className="eyebrow gold-eyebrow">{home.commitmentEyebrow}</p>
            <img src={images.commitmentLogo} alt="Eduardo Ferreira Cavalheiro — Advogado Previdenciário" className="proof-logo" />
          </div>
          <div className="proof-points">
            {home.commitmentPoints.filter((point) => point.title.trim() || point.text.trim()).map((point, index) => <article className={`proof-point proof-point-${index + 1}`} key={`${point.title}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{point.title}</strong>{point.title && point.text ? " " : ""}{point.text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="areas" className="section section-stone areas-section traced-section">
        <div className="content-width section-heading-row areas-heading">
          <p className="eyebrow areas-eyebrow"><span aria-hidden="true" /> {home.areasEyebrow}</p>
          <h2>{home.areasTitle}</h2>
          <p className="section-side-copy">{home.areasDescription}</p>
        </div>
        <div className="content-width areas-grid">
          {home.areas.filter((area) => area.title.trim() || area.summary.trim() || area.slug.trim()).map((area) => {
            const Icon = iconMap[area.icon];
            return (
              <Link href={`/areas/${area.slug}`} className="area-card" key={area.slug}>
                <div className="area-card-top"><span className="area-number">{area.number}</span><span className="area-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span></div>
                <div><h3>{area.title}</h3><p>{area.summary}</p></div>
                <span className="card-link">Ver orientações <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="duvidas" className="section faq-section traced-section">
        <div className="content-width faq-layout">
          <div className="faq-intro">
            <p className="eyebrow gold-eyebrow">{home.faqsEyebrow}</p>
            <h2>{home.faqsTitle}</h2>
            <p>{home.faqsDescription}</p>
            <div className="flex flex-wrap gap-3">
              <a className="button button-outline-light" href={whatsappLink("Olá, Eduardo. Tenho uma dúvida previdenciária e gostaria de receber orientação.", content.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" /> Enviar minha dúvida</a>
              <Link className="button button-outline-light" href="/blog"><BookOpen size={18} aria-hidden="true" /> Ler o blog</Link>
            </div>
          </div>
          <Accordion type="single" collapsible className="faq-accordion">
            {home.faqs.filter((faq) => faq.question.trim() || faq.answer.trim()).map((faq, index) => (
              <AccordionItem value={`faq-${index}`} key={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="contato" className="section section-paper contact-section traced-section">
        <div className="content-width contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">{home.contactEyebrow}</p>
            <h2>{home.contactTitle}</h2>
            <p>{home.contactDescription}</p>
            <div className="contact-direct-list">
              <a href="tel:+5522998037866"><span><Phone size={18} aria-hidden="true" /></span><div><small>Telefone e WhatsApp</small><strong>(22) 99803-7866</strong></div></a>
              <a href="mailto:adv@eduardocavalheiro.com"><span><Mail size={18} aria-hidden="true" /></span><div><small>E-mail</small><strong>adv@eduardocavalheiro.com</strong></div></a>
              <a href="https://www.instagram.com/eduardof.cavalheiro/" target="_blank" rel="noreferrer"><span><Instagram size={18} aria-hidden="true" /></span><div><small>Instagram</small><strong>@eduardof.cavalheiro</strong></div></a>
              <a href="https://www.tiktok.com/@eduardocavalheiroadv" target="_blank" rel="noreferrer"><span><Quote size={18} aria-hidden="true" /></span><div><small>TikTok</small><strong>@eduardocavalheiroadv</strong></div></a>
            </div>
            <div className="location-note"><MapPin size={18} aria-hidden="true" /><span><strong>Itaperuna/RJ</strong><br />{home.locationNote}</span></div>
            <div className="contact-location-card">
              <div className="contact-location-icon"><MapPin size={20} aria-hidden="true" /></div>
              <div>
                <small>Endereço do escritório</small>
                <strong>{officeAddress}</strong>
                <span className="contact-hours"><CalendarDays size={15} aria-hidden="true" /> {content.officeHours}</span>
                <div className="contact-location-actions">
                  <a className="text-link dark-link" href={officeMapsLink} target="_blank" rel="noreferrer">Ver localização no Google Maps <ArrowRight size={17} aria-hidden="true" /></a>
                  <a className="button button-navy directions-button" href={officeDirectionsLink} target="_blank" rel="noreferrer"><Route size={16} aria-hidden="true" /> Como chegar</a>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-heading"><FileCheck2 size={21} aria-hidden="true" /><div><p>Mensagem inicial</p><small>Ao enviar, você será direcionado ao WhatsApp.</small></div></div>
            <label>Nome completo<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Como podemos chamar você?" /></label>
            <div className="form-two-columns">
              <label>Telefone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(00) 00000-0000" /></label>
              <label>E-mail<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="seuemail@exemplo.com" /></label>
            </div>
              <label>Assunto<select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}><option value="">Selecione uma área</option>{home.areas.filter((area) => area.title.trim()).map((area) => <option key={area.slug} value={area.title}>{area.title}</option>)}</select></label>
            <label>Como podemos ajudar?<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={4} placeholder="Descreva brevemente sua dúvida ou situação." /></label>
            <button className="button button-navy form-submit" type="submit"><Send size={18} aria-hidden="true" /> Enviar para o WhatsApp</button>
            {sentMessage && <p className="form-message" role="status">{sentMessage}</p>}
            <p className="form-privacy">Não envie senhas, dados bancários, documentos ou informações sigilosas por este formulário. O contato inicial não substitui análise jurídica individual. Consulte o <Link href="/privacidade">aviso de privacidade</Link>.</p>
          </form>
        </div>
      </section>

      <section className="source-note">
        <div className="content-width"><BookOpen size={17} aria-hidden="true" /><p>{home.sourceNote} Consulte o <a href="https://www.gov.br/inss/pt-br" target="_blank" rel="noreferrer">portal oficial do INSS</a> e busque orientação individual para avaliar o seu caso.</p></div>
      </section>
    </SiteShell>
  );
}
