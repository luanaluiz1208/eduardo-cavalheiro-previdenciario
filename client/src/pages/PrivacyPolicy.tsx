import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import SiteShell from "@/components/SiteShell";

export default function PrivacyPolicy() {
  return (
    <SiteShell>
      <main className="privacy-page">
        <div className="content-width privacy-page-inner">
          <Link href="/" className="back-link"><ArrowLeft size={16} aria-hidden="true" /> Voltar ao início</Link>
          <p className="eyebrow gold-eyebrow"><ShieldCheck size={15} aria-hidden="true" /> Privacidade</p>
          <h1>Aviso de privacidade</h1>
          <p className="privacy-lead">Este aviso explica, de forma objetiva, como o escritório pode tratar os dados enviados pelos canais digitais do site.</p>
          <p className="privacy-updated">Última atualização: 9 de outubro de 2026</p>

          <div className="privacy-content">
            <section><h2>1. Quais dados podem ser enviados</h2><p>Nos formulários, comentários e canais de contato, você pode informar nome, telefone, e-mail, assunto e uma descrição inicial da dúvida. Evite inserir documentos, números de benefício, dados bancários, senhas, informações médicas detalhadas ou outros dados sensíveis em campos abertos e no WhatsApp sem orientação específica.</p></section>
            <section><h2>2. Para que esses dados são usados</h2><p>Os dados são utilizados para responder ao contato, compreender o assunto indicado, agendar atendimento, prestar informações iniciais e, quando solicitado, avisar sobre uma resposta ao comentário. O escritório procura coletar apenas o necessário para o primeiro retorno.</p></section>
            <section><h2>3. Compartilhamento e segurança</h2><p>O conteúdo não é comercializado. O acesso é limitado às pessoas e serviços necessários para receber e responder às mensagens, manter o site e operar os canais escolhidos. Nenhum canal eletrônico é absolutamente livre de riscos; por isso, o primeiro contato deve ser breve e sem documentos ou detalhes desnecessários.</p></section>
            <section><h2>4. Comentários no blog</h2><p>O nome e o comentário podem ficar visíveis no artigo após o envio. O e-mail informado no comentário não é exibido publicamente e pode ser usado para avisar sobre uma resposta. Não publique informações que identifiquem terceiros ou revelem sua situação além do necessário.</p></section>
            <section><h2>5. Seus direitos e contato</h2><p>Para dúvidas sobre privacidade, correção ou tratamento dos dados enviados, entre em contato pelo e-mail abaixo. Solicitações podem exigir confirmação da identidade e serão avaliadas conforme a legislação aplicável.</p><a className="privacy-contact" href="mailto:adv@eduardocavalheiro.com"><Mail size={17} aria-hidden="true" /> adv@eduardocavalheiro.com</a></section>
            <section><h2>6. Importante</h2><p>Este texto é um aviso público e informativo, não substitui a política interna de privacidade nem uma avaliação jurídica específica. O escritório deve revisar e validar este conteúdo com o profissional responsável pela privacidade e proteção de dados antes de adotá-lo como política definitiva.</p></section>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
