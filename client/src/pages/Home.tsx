/**
 * Direção visual: Arquivo de Confiança — composição editorial assimétrica, azul-marinho profundo e dourado de arquivo.
 * Objetivo da página: transformar uma dúvida previdenciária em um próximo passo claro de contato, sem promessas de resultado.
 */

import { FormEvent, useState, type ComponentType } from "react";
import { Link } from "wouter";
import {
  Accessibility, Activity, ArrowDownRight, ArrowRight, Baby, BadgeCheck, BookOpen,
  CalendarDays, Check, Compass, FileCheck2, HandHeart, HeartPulse, Instagram,
  Mail, MapPin, MessageCircle, Phone, Quote, RefreshCcw, Route, Send, ShieldCheck,
  UsersRound, Wheat,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteShell from "@/components/SiteShell";
import { areas, type AreaIcon, whatsappLink } from "@/data/areas";
import { mapsDirectionsLink, mapsSearchLink, useSiteContent } from "@/data/siteContent";

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
};



const faqs = [
  {
    question: "Preciso ter contribuído para o INSS para buscar o BPC/LOAS?",
    answer: "Não. O BPC/LOAS é um benefício assistencial, por isso não exige contribuição prévia ao INSS. Ele possui critérios próprios de idade ou deficiência, renda familiar, CadÚnico e, conforme o caso, avaliações do INSS.",
  },
  {
    question: "Quais documentos devo separar para uma primeira análise?",
    answer: "Identificação e CPF, CNIS, carteira de trabalho, carnês de contribuição e documentos específicos do seu caso. Para incapacidade, são úteis laudos e exames; para trabalho rural, documentos que comprovem a atividade; para aposentadoria especial, PPP e documentos técnicos.",
  },
  {
    question: "Todo pedido exige perícia médica?",
    answer: "Não. A perícia costuma ser importante em benefícios por incapacidade, BPC da pessoa com deficiência e aposentadorias que dependam da avaliação da deficiência. Outros benefícios têm fluxos diferentes. A necessidade é verificada de acordo com o pedido e com a exigência do INSS.",
  },
  {
    question: "O atendimento pode ser realizado on-line?",
    answer: "Sim. O escritório atende presencialmente em Itaperuna/RJ e também realiza atendimento on-line para pessoas de todo o território nacional, com orientação adequada a cada etapa.",
  },
  {
    question: "Meu benefício foi indeferido. Ainda é possível avaliar o caso?",
    answer: "Sim. Uma decisão negativa pode ser analisada com base no motivo apresentado pelo INSS, nos documentos disponíveis e nos prazos aplicáveis. O primeiro passo é compreender exatamente o que foi reconhecido e o que precisa ser demonstrado.",
  },
  {
    question: "A orientação jurídica garante a concessão do benefício?",
    answer: "Não. A concessão depende da legislação, das provas, do histórico contributivo e da análise do órgão competente. O trabalho jurídico é apresentar o caso com organização, coerência técnica e transparência sobre as possibilidades.",
  },
];

export default function Home() {
  const content = useSiteContent();
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
        <div className="hero-background" style={{ backgroundImage: "linear-gradient(90deg, rgba(11,31,58,0.98) 0%, rgba(11,31,58,0.93) 47%, rgba(11,31,58,0.66) 100%), url('/assets/hero-arquivo-previdenciario.jpg')" }} />
        <div className="hero-journey-rail" aria-hidden="true"><span>01</span><i /></div>
        <div className="content-width hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span /> Direito Previdenciário</div>
            <h1 id="hero-title">{content.heroTitle}</h1>
            <p>{content.heroDescription}</p>
            <div className="hero-actions">
              <a className="button button-gold" href={whatsappLink("Olá, Eduardo. Quero entender melhor a minha situação previdenciária.", content.whatsapp)} target="_blank" rel="noreferrer">
                <MessageCircle size={19} aria-hidden="true" /> Conversar pelo WhatsApp
              </a>
              <a className="text-link light-link" href="#areas">Conheça as áreas <ArrowDownRight size={18} aria-hidden="true" /></a>
            </div>
            <div className="hero-notes">
              <span><Check size={15} aria-hidden="true" /> Atendimento presencial em Itaperuna</span>
              <span><Check size={15} aria-hidden="true" /> Consultas on-line em todo o país</span>
            </div>
          </div>

          <div className="hero-portrait-wrap" aria-label="Eduardo Ferreira Cavalheiro">
            <div className="portrait-index" aria-hidden="true">EC<br /><span>26.639/23</span></div>
            <div className="portrait-frame">
              <img src="/assets/eduardo-ferreira-cavalheiro-nova.jpg" alt="Eduardo Ferreira Cavalheiro" className="hero-portrait" />
              <div className="portrait-caption"><span>Eduardo Ferreira Cavalheiro</span><small>Advogado Previdenciarista · OAB/RJ nº 26.639/23</small></div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="section section-paper about-section traced-section">
        <div className="content-width offset-grid">
          <div className="section-intro narrow-intro about-photo" style={{ backgroundImage: "linear-gradient(180deg, rgba(11,31,58,0.06), rgba(11,31,58,0.48)), url('/assets/atendimento-acolhedor.jpg')" }} aria-label="Atendimento jurídico acolhedor" />
          <div className="about-copy">
            <p className="lead-copy">Eduardo Ferreira Cavalheiro é advogado especializado em Direito Previdenciário, com atuação voltada à defesa dos direitos dos segurados perante o INSS e o Poder Judiciário.</p>
            <p>Natural de Itaperuna/RJ, realiza atendimentos presenciais e on-line para clientes de todo o Brasil. Atua em demandas relacionadas a benefícios por incapacidade, aposentadorias, pensão por morte, auxílio-acidente, BPC/LOAS e planejamento previdenciário.

Seu trabalho é pautado em análise técnica, estratégia jurídica e atendimento próximo, buscando identificar a melhor solução para cada caso e conduzir o cliente com segurança desde a análise da documentação até a conclusão do processo.</p>
            <div className="about-signature">
              <span className="signature-line" />
              <div><strong>Eduardo Ferreira Cavalheiro</strong><small>Advogado Previdenciarista · OAB/RJ nº 26.639/23</small></div>
            </div>
            <a className="text-link dark-link" href={whatsappLink("Olá, Eduardo. Gostaria de agendar uma conversa sobre Direito Previdenciário.", content.whatsapp)} target="_blank" rel="noreferrer">Agendar uma conversa <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="section proof-section traced-section">
        <div className="content-width proof-grid">
          <div className="proof-copy">
            <p className="eyebrow gold-eyebrow">Nosso compromisso</p>
            <img src="/assets/logo-eduardo-ferreira-cavalheiro-original.jpeg" alt="Eduardo Ferreira Cavalheiro — Advogado Previdenciário" className="proof-logo" />
          </div>
          <div className="proof-points">
            <article><span>01</span><p><strong>Transparência</strong> sobre documentos, etapas e possibilidades antes de cada decisão.</p></article>
            <article><span>02</span><p><strong>Atenção individual</strong> ao histórico de contribuições e às particularidades de cada segurado.</p></article>
            <article><span>03</span><p><strong>Orientação responsável</strong> para que você compreenda os próximos passos do seu pedido.</p></article>
          </div>
        </div>
      </section>

      <section id="areas" className="section section-stone areas-section traced-section">
        <div className="content-width section-heading-row">
          <div>
            <p className="eyebrow">Áreas de atuação</p>
            <h2>Entenda o ponto de partida do seu direito.</h2>
          </div>
          <p className="section-side-copy">Cada área possui uma página própria com informações sobre quem pode ter direito, requisitos gerais e como o apoio jurídico pode ajudar.</p>
        </div>
        <div className="content-width areas-grid">
          {areas.map((area) => {
            const Icon = iconMap[area.icon];
            return (
              <Link href={`/areas/${area.slug}`} className="area-card" key={area.slug}>
                <div className="area-card-top"><span className="area-number">{area.number}</span><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></div>
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
            <p className="eyebrow gold-eyebrow">Dúvidas frequentes</p>
            <h2>Informação é o primeiro passo para uma decisão mais segura.</h2>
            <p>As respostas abaixo são gerais. Cada caso exige análise do histórico, da documentação e da legislação aplicável.</p>
            <div className="flex flex-wrap gap-3">
              <a className="button button-outline-light" href={whatsappLink("Olá, Eduardo. Tenho uma dúvida previdenciária e gostaria de receber orientação.", content.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" /> Enviar minha dúvida</a>
              <Link className="button button-outline-light" href="/blog"><BookOpen size={18} aria-hidden="true" /> Ler o blog</Link>
            </div>
          </div>
          <Accordion type="single" collapsible className="faq-accordion">
            {faqs.map((faq, index) => (
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
            <p className="eyebrow">Entre em contato</p>
            <h2>Conte o que aconteceu. Vamos identificar o melhor ponto de partida.</h2>
            <p>Você pode enviar uma mensagem pelo formulário, falar diretamente no WhatsApp ou utilizar um dos canais abaixo.</p>
            <div className="contact-direct-list">
              <a href="tel:+5522998037866"><span><Phone size={18} aria-hidden="true" /></span><div><small>Telefone e WhatsApp</small><strong>(22) 99803-7866</strong></div></a>
              <a href="mailto:adv@eduardocavalheiro.com"><span><Mail size={18} aria-hidden="true" /></span><div><small>E-mail</small><strong>adv@eduardocavalheiro.com</strong></div></a>
              <a href="https://www.instagram.com/eduardof.cavalheiro/" target="_blank" rel="noreferrer"><span><Instagram size={18} aria-hidden="true" /></span><div><small>Instagram</small><strong>@eduardof.cavalheiro</strong></div></a>
              <a href="https://www.tiktok.com/@eduardocavalheiroadv" target="_blank" rel="noreferrer"><span><Quote size={18} aria-hidden="true" /></span><div><small>TikTok</small><strong>@eduardocavalheiroadv</strong></div></a>
            </div>
            <div className="location-note"><MapPin size={18} aria-hidden="true" /><span><strong>Itaperuna/RJ</strong><br />Atendimento presencial mediante agendamento.</span></div>
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
            <label>Assunto<select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}><option value="">Selecione uma área</option>{areas.map((area) => <option key={area.slug} value={area.title}>{area.title}</option>)}</select></label>
            <label>Como podemos ajudar?<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows={4} placeholder="Descreva brevemente sua dúvida ou situação." /></label>
            <button className="button button-navy form-submit" type="submit"><Send size={18} aria-hidden="true" /> Enviar para o WhatsApp</button>
            {sentMessage && <p className="form-message" role="status">{sentMessage}</p>}
            <p className="form-privacy">Não envie senhas, dados bancários ou informações sigilosas por este formulário. O contato inicial não substitui análise jurídica individual.</p>
          </form>
        </div>
      </section>

      <section className="source-note">
        <div className="content-width"><BookOpen size={17} aria-hidden="true" /><p>O conteúdo do site possui caráter informativo e é atualizado a partir de referências institucionais. Consulte sempre o <a href="https://www.gov.br/inss/pt-br" target="_blank" rel="noreferrer">portal oficial do INSS</a> e busque orientação individual para avaliar o seu caso.</p></div>
      </section>
    </SiteShell>
  );
}
