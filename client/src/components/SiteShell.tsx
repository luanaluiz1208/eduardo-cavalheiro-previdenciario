/**
 * Direção visual: Arquivo de Confiança — navegação calma, materiais sóbrios e dourado pontual.
 * Este componente preserva a mesma rota de contato e a assinatura institucional em todas as páginas.
 */

import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Instagram, Mail, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { whatsappLink } from "@/data/areas";
import { mapsSearchLink, useSiteContent } from "@/data/siteContent";

type SiteShellProps = {
  children: ReactNode;
};

const navItems = [
  { label: "O escritório", href: "/#sobre" },
  { label: "Áreas de atuação", href: "/#areas" },
  { label: "Dúvidas frequentes", href: "/#duvidas" },
  { label: "Providenciando a Previdência", href: "/blog" },
  { label: "Contato", href: "/#contato" },
];

export default function SiteShell({ children }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useSiteContent();
  const officeMapsLink = mapsSearchLink(content.officeAddress);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <div className="top-line">
        <div className="content-width top-line-inner">
          <span><MapPin size={14} aria-hidden="true" /> Itaperuna · Rio de Janeiro</span>
          <span className="top-line-availability">Atendimento presencial e online em todo o Brasil</span>
        </div>
      </div>

      <header className="site-header">
        <div className="content-width nav-inner">
          <Link href="/" className="brand" aria-label="Página inicial de Eduardo Ferreira Cavalheiro">
            <img src="/assets/logo-eduardo-ferreira-cavalheiro-original.jpeg" alt="Eduardo Ferreira Cavalheiro — Advogado Previdenciário" className="brand-logo" />
          </Link>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navItems.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          </nav>

          <a href={whatsappLink("Olá, Eduardo. Gostaria de falar sobre meu caso previdenciário.", content.whatsapp)} className="header-cta" target="_blank" rel="noreferrer">
            <MessageCircle size={17} aria-hidden="true" /> Falar no WhatsApp
          </a>

          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <nav aria-label="Navegação móvel">
              {navItems.map((item) => <a href={item.href} onClick={closeMenu} key={item.href}>{item.label}</a>)}
            </nav>
            <a href={whatsappLink("Olá, Eduardo. Gostaria de falar sobre meu caso previdenciário.", content.whatsapp)} className="button button-gold" target="_blank" rel="noreferrer" onClick={closeMenu}>
              <MessageCircle size={18} aria-hidden="true" /> Falar no WhatsApp
            </a>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="content-width footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link" aria-label="Voltar ao início">
              <img src="/assets/logo-eduardo-ferreira-cavalheiro-original.jpeg" alt="Eduardo Ferreira Cavalheiro — Advogado Previdenciário" className="footer-logo" />
            </Link>
            <p>Orientação previdenciária com atenção ao seu histórico, à sua documentação e ao próximo passo mais adequado.</p>
          </div>
          <div className="footer-column">
            <p className="footer-label">Navegue</p>
            <a href="/#sobre">O escritório</a>
            <a href="/#areas">Áreas de atuação</a>
            <a href="/#duvidas">Dúvidas frequentes</a>
            <a href="/blog">Providenciando a Previdência</a>
            <a href="/#contato">Contato</a>
          </div>
            <div className="footer-column">
            <p className="footer-label">Canais de contato</p>
            <a href={whatsappLink("Olá, Eduardo. Gostaria de falar sobre meu caso previdenciário.", content.whatsapp)} target="_blank" rel="noreferrer"><Phone size={15} aria-hidden="true" />{content.whatsapp}</a>
            <a href={`mailto:${content.email}`}><Mail size={15} aria-hidden="true" />{content.email}</a>
            <a href={`https://www.instagram.com/${content.instagram.replace(/^@/, "")}/`} target="_blank" rel="noreferrer"><Instagram size={15} aria-hidden="true" />{content.instagram}</a>
            <a href={officeMapsLink} target="_blank" rel="noreferrer"><MapPin size={15} aria-hidden="true" />Ver no Google Maps</a>
            <p className="footer-meta"><MapPin size={15} aria-hidden="true" />{content.officeAddress}</p>
            <p className="footer-meta"><span aria-hidden="true">◷</span>{content.officeHours}</p>
          </div>
        </div>
        <div className="content-width footer-bottom">
          <p>© {new Date().getFullYear()} Eduardo Ferreira Cavalheiro. OAB/RJ nº 26.639/23.</p>
          <p>Conteúdo informativo. A análise depende das particularidades de cada caso.</p>
        </div>
      </footer>

      <a href={whatsappLink("Olá, Eduardo. Gostaria de falar sobre meu caso previdenciário.", content.whatsapp)} className="whatsapp-fab" target="_blank" rel="noreferrer" aria-label="Iniciar conversa no WhatsApp" title="Falar com Eduardo pelo WhatsApp">
        <MessageCircle size={23} aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
