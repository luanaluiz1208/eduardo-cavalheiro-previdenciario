import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, Building2, Check, ExternalLink, FilePlus2, HelpCircle, Image as ImageIcon, LayoutDashboard, Loader2, LogOut, MessageCircle, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { siteContentDefaults, homeContentDefaults, parseHomeContent, parseSiteImages, siteImageDefaults, type HomeEditableContent, type SiteContentKey, type SiteContentValues, type SiteImages, type SiteImageKey } from "@/data/siteContent";
import { blogArticles, type BlogArticle, type BlogSection } from "@/data/blog";
import { adminRequest } from "@/lib/adminApi";
import RichTextEditor from "@/components/admin/RichTextEditor";

type ManagedArticle = BlogArticle & { id?: string; published: boolean; featured: boolean };
type AdminComment = { id: string; articleSlug: string; name: string; email: string; message: string; replies?: Array<{ id: string; message: string; createdAt: string }>; createdAt: string };
type TabKey = "institutional" | "home" | "images" | "areas" | "faq" | "blog" | "comments";

const contentFields: Array<{ key: SiteContentKey; label: string; description: string; multiline?: boolean }> = [
  { key: "heroTitle", label: "Nome exibido na abertura", description: "Título principal da primeira tela." },
  { key: "heroDescription", label: "Texto de apresentação", description: "Resumo institucional abaixo do nome.", multiline: true },
  { key: "officeAddress", label: "Endereço completo", description: "Atualiza os links de localização.", multiline: true },
  { key: "officeHours", label: "Horário de atendimento", description: "Exemplo: Segunda a sexta · 9h às 18h." },
  { key: "whatsapp", label: "WhatsApp", description: "Número usado nos botões de contato." },
  { key: "email", label: "E-mail", description: "Canal exibido no rodapé." },
  { key: "instagram", label: "Instagram", description: "Informe o usuário com ou sem @." },
  { key: "tiktok", label: "TikTok", description: "Informe o usuário com ou sem @." },
];

const tabs: Array<{ key: TabKey; label: string; icon: typeof Building2 }> = [
  { key: "institutional", label: "Institucional", icon: Building2 },
  { key: "home", label: "Textos da home", icon: LayoutDashboard },
  { key: "images", label: "Imagens do site", icon: ImageIcon },
  { key: "areas", label: "Áreas de atuação", icon: BookOpen },
  { key: "faq", label: "Dúvidas frequentes", icon: HelpCircle },
  { key: "blog", label: "Blog", icon: Pencil },
  { key: "comments", label: "Comentários", icon: MessageCircle },
];

function initialArticle(): ManagedArticle {
  return { slug: "novo-artigo", category: "Previdência Social", title: "Novo artigo", excerpt: "Escreva um resumo claro para orientar a leitura.", readTime: "5 min de leitura", date: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()), featured: false, published: true, sections: [{ heading: "Introdução", body: "<p>Escreva aqui o primeiro parágrafo do artigo.</p>" }], sourceLabel: "Fonte oficial", sourceUrl: "" };
}
function normalizeStaticArticle(article: BlogArticle): ManagedArticle { return { ...article, published: article.published !== false, featured: Boolean(article.featured) }; }

const imageSlots: Array<{ key: SiteImageKey; label: string; description: string }> = [
  { key: "heroBackground", label: "Imagem de fundo da abertura", description: "Imagem horizontal usada atrás do título principal." },
  { key: "heroPortrait", label: "Retrato da abertura", description: "Foto principal ao lado do texto inicial." },
  { key: "aboutPortrait", label: "Foto da apresentação", description: "Imagem da seção sobre o escritório." },
  { key: "commitmentLogo", label: "Logo do compromisso", description: "Imagem exibida na seção Nosso compromisso." },
  { key: "headerLogo", label: "Logo do cabeçalho", description: "Logo usada no menu e no rodapé." },
];

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("O arquivo não é uma imagem válida."));
      image.onload = () => {
        const max = 1800;
        const ratio = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", .84));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
function inputClass(multiline = false) { return `mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31] focus:ring-2 focus:ring-[#c3a468]/30 ${multiline ? "min-h-28" : ""}`; }
function Field({ label, value, onChange, multiline = false, description }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; description?: string }) { return <label className="block text-sm font-semibold"><span>{label}</span>{description ? <small className="mt-1 block font-normal leading-5 text-slate-500">{description}</small> : null}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} className={inputClass(true)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass()} />}</label>; }

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<TabKey>("institutional");
  const [content, setContent] = useState<SiteContentValues>(siteContentDefaults);
  const [home, setHome] = useState<HomeEditableContent>(homeContentDefaults);
  const [images, setImages] = useState<SiteImages>(siteImageDefaults);
  const [articles, setArticles] = useState<ManagedArticle[]>(() => blogArticles.map(normalizeStaticArticle));
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [selected, setSelected] = useState<ManagedArticle | null>(null);
  const [areaIndex, setAreaIndex] = useState(0);
  const [faqIndex, setFaqIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [savingReply, setSavingReply] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readCommentIds, setReadCommentIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const session = await adminRequest<{ authenticated: boolean }>("/api/auth/session");
        if (!session.authenticated) { setLocation("/admin/login"); return; }
        const [contentResponse, articleResponse, commentResponse] = await Promise.all([
          adminRequest<{ content: Partial<SiteContentValues> & { homeContent?: string; homeImages?: string } }>("/api/content"),
          adminRequest<{ articles: ManagedArticle[] }>("/api/articles"),
          adminRequest<{ comments: AdminComment[] }>("/api/comments"),
        ]);
        if (!active) return;
        setContent((current) => ({ ...current, ...contentResponse.content }));
        setHome(parseHomeContent(contentResponse.content.homeContent));
        setImages(parseSiteImages(contentResponse.content.homeImages));
        setComments(commentResponse.comments || []);
        try { setReadCommentIds(JSON.parse(window.localStorage.getItem("admin-read-comment-ids") || "[]")); } catch { setReadCommentIds([]); }
        if (articleResponse.articles.length) {
          const storedSlugs = new Set(articleResponse.articles.map((article) => article.slug));
          setArticles([...articleResponse.articles, ...blogArticles.map(normalizeStaticArticle).filter((article) => !storedSlugs.has(article.slug))]);
        }
      } catch { setLocation("/admin/login"); } finally { if (active) setChecking(false); }
    }
    void load(); return () => { active = false; };
  }, [setLocation]);

  const selectedArea = home.areas[areaIndex];
  const selectedFaq = home.faqs[faqIndex];
  const selectedIndex = useMemo(() => selected ? articles.findIndex((article) => (selected.id && article.id === selected.id) || article.slug === selected.slug) : -1, [articles, selected]);
  const unreadComments = comments.filter((comment) => !readCommentIds.includes(comment.id));
  const clearStatus = () => { setMessage(""); setError(""); };

  async function saveContent(extra: Record<string, string> = {}) {
    setSaving(true); clearStatus();
    try { await adminRequest("/api/content", { method: "PUT", body: JSON.stringify({ content: { ...content, ...extra } }) }); setMessage("Alterações salvas. A página pública será atualizada automaticamente."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível salvar as alterações."); }
    finally { setSaving(false); }
  }
  async function saveInstitutional(event: FormEvent) { event.preventDefault(); await saveContent(); }
  async function saveHome(event: FormEvent) { event.preventDefault(); await saveContent({ homeContent: JSON.stringify(home) }); }
  async function saveImages(event: FormEvent) { event.preventDefault(); await saveContent({ homeImages: JSON.stringify(images) }); }
  async function saveArticle(event: FormEvent) {
    event.preventDefault(); if (!selected) return; setSaving(true); clearStatus();
    try { const path = selected.id ? `/api/articles/${selected.id}` : "/api/articles"; const response = await adminRequest<{ article: ManagedArticle }>(path, { method: selected.id ? "PUT" : "POST", body: JSON.stringify({ article: selected }) }); setArticles((current) => { const index = current.findIndex((article) => (response.article.id && article.id === response.article.id) || article.slug === selected.slug); return index >= 0 ? current.map((article, itemIndex) => itemIndex === index ? response.article : article) : [response.article, ...current]; }); setSelected(response.article); setMessage("Artigo salvo com sucesso."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível salvar o artigo."); } finally { setSaving(false); }
  }
  function updateSection(index: number, value: BlogSection) { if (selected) setSelected({ ...selected, sections: selected.sections.map((section, itemIndex) => itemIndex === index ? value : section) }); }
  function toggleNotifications() { const nextVisible = !showNotifications; setShowNotifications(nextVisible); if (nextVisible) { const ids = comments.map((comment) => comment.id); setReadCommentIds((current) => { const next = Array.from(new Set([...current, ...ids])); window.localStorage.setItem("admin-read-comment-ids", JSON.stringify(next)); return next; }); } }
  async function replyToComment(comment: AdminComment) { if (!replyText.trim()) return; setSavingReply(true); clearStatus(); try { const response = await adminRequest<{ reply: { id: string; message: string; createdAt: string }; emailSent: boolean }>("/api/comments", { method: "POST", body: JSON.stringify({ action: "reply", commentId: comment.id, reply: replyText }) }); setComments((current) => current.map((item) => item.id === comment.id ? { ...item, replies: [...(item.replies || []), response.reply] } : item)); setReplyTarget(null); setReplyText(""); setMessage(response.emailSent ? "Resposta publicada e aviso enviado por e-mail." : "Resposta publicada. O aviso por e-mail ainda precisa ser configurado."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível responder ao comentário."); } finally { setSavingReply(false); } }
  async function logout() { await adminRequest("/api/auth/logout", { method: "POST" }).catch(() => undefined); setLocation("/admin/login"); }

  if (checking) return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] text-[#0b1f3a]"><Loader2 className="animate-spin" size={26} /><span className="ml-3 text-sm">Verificando acesso administrativo…</span></main>;
  const updateHome = <K extends keyof HomeEditableContent>(key: K, value: HomeEditableContent[K]) => setHome((current) => ({ ...current, [key]: value }));
  const updateArea = (patch: Partial<typeof selectedArea>) => setHome((current) => ({ ...current, areas: current.areas.map((area, index) => index === areaIndex ? { ...area, ...patch } : area) }));
  const updateFaq = (patch: Partial<typeof selectedFaq>) => setHome((current) => ({ ...current, faqs: current.faqs.map((faq, index) => index === faqIndex ? { ...faq, ...patch } : faq) }));

  return <main className="min-h-screen bg-[#f7f4ed] text-[#0b1f3a]">
    <header className="border-b border-[#c3a468]/60 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d6b31]">Arquivo de Confiança · Administração</p><h1 className="mt-1 font-serif text-3xl leading-none">Painel do escritório</h1></div><div className="flex items-center gap-3"><div className="relative"><button type="button" onClick={toggleNotifications} aria-label="Notificações de comentários" className="relative inline-flex h-10 w-10 items-center justify-center border border-[#0b1f3a]/20"><Bell size={18} />{unreadComments.length ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a32929] px-1 text-[10px] font-bold text-white">{unreadComments.length > 9 ? "9+" : unreadComments.length}</span> : null}</button>{showNotifications ? <div className="absolute right-0 top-12 z-20 w-[min(22rem,calc(100vw-2rem))] border border-[#c3a468]/60 bg-[#fffaf0] p-4 shadow-xl"><strong className="font-serif text-xl">Comentários recebidos</strong><div className="mt-3 max-h-80 space-y-2 overflow-y-auto">{comments.map((comment) => <article key={comment.id} className="border-l-2 border-[#c3a468] bg-white px-3 py-2"><div className="flex items-center justify-between gap-3"><a href={`/blog/${comment.articleSlug}#comentarios`} target="_blank" rel="noreferrer" className="min-w-0 flex-1"><strong className="block truncate text-sm">{comment.name}</strong><span className="block truncate text-xs text-slate-500">Ver comentário →</span></a><button type="button" onClick={() => setReplyTarget(replyTarget === comment.id ? null : comment.id)} className="text-xs font-bold text-[#8d6b31]">Responder</button></div>{replyTarget === comment.id ? <div className="mt-2"><textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={3} placeholder="Escreva sua resposta..." className="w-full border border-slate-300 p-2 text-sm" /><button type="button" disabled={savingReply} onClick={() => void replyToComment(comment)} className="mt-2 bg-[#0b1f3a] px-3 py-2 text-xs font-bold text-white">{savingReply ? "Enviando..." : "Publicar resposta"}</button></div> : null}</article>)}</div></div> : null}</div><Link href="/" target="_blank" className="inline-flex items-center gap-2 border border-[#0b1f3a]/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]"><ExternalLink size={14} /> Ver site</Link><button type="button" onClick={logout} className="inline-flex items-center gap-2 px-2 py-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-600"><LogOut size={14} /> Sair</button></div></div></header>
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <nav className="flex gap-2 overflow-x-auto border-b border-[#d9d3c8] pb-1" aria-label="Seções do painel">{tabs.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => { setTab(key); clearStatus(); }} className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] transition ${tab === key ? "border-[#8d6b31] text-[#8d6b31]" : "border-transparent text-slate-500 hover:text-[#0b1f3a]"}`}><Icon size={15} /> {label}{key === "comments" && unreadComments.length ? <span className="rounded-full bg-[#a32929] px-1.5 py-0.5 text-[10px] text-white">{unreadComments.length}</span> : null}</button>)}</nav>
      {message ? <p className="mt-5 border-l-2 border-[#8d6b31] bg-[#fff7df] px-4 py-3 text-sm text-[#5e451d]">{message}</p> : null}{error ? <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
      <div className="mt-6">
        <div className="border border-[#d9d3c8] bg-white p-5 shadow-[8px_8px_0_rgba(195,164,104,0.08)] sm:p-7">
          {tab === "institutional" ? <form onSubmit={saveInstitutional}><SectionTitle number="01" title="Dados institucionais" description="Informações de contato, localização e canais oficiais." /><div className="mt-6 grid gap-5 md:grid-cols-2">{contentFields.map((field) => <Field key={field.key} label={field.label} description={field.description} multiline={field.multiline} value={content[field.key]} onChange={(value) => setContent({ ...content, [field.key]: value })} />)}</div><SaveButton saving={saving} label="Salvar dados institucionais" /></form> : null}
          {tab === "home" ? <form onSubmit={saveHome}><SectionTitle number="02" title="Textos da página inicial" description="Edite títulos, chamadas, compromisso e textos de contato da home." /><div className="mt-6 grid gap-5 md:grid-cols-2"><Field label="Kicker da abertura" value={home.heroKicker} onChange={(value) => updateHome("heroKicker", value)} /><Field label="Botão principal" value={home.heroPrimaryCta} onChange={(value) => updateHome("heroPrimaryCta", value)} /><Field label="Link secundário" value={home.heroSecondaryCta} onChange={(value) => updateHome("heroSecondaryCta", value)} /><Field label="Nome na apresentação" value={home.aboutName} onChange={(value) => updateHome("aboutName", value)} /><Field label="Texto introdutório" value={home.aboutLead} multiline onChange={(value) => updateHome("aboutLead", value)} /><Field label="Texto completo da apresentação" value={home.aboutBody} multiline onChange={(value) => updateHome("aboutBody", value)} /><Field label="Botão da apresentação" value={home.aboutCta} onChange={(value) => updateHome("aboutCta", value)} /><Field label="Título do compromisso" value={home.commitmentEyebrow} onChange={(value) => updateHome("commitmentEyebrow", value)} /><Field label="Título das áreas" value={home.areasTitle} onChange={(value) => updateHome("areasTitle", value)} /><Field label="Descrição das áreas" value={home.areasDescription} multiline onChange={(value) => updateHome("areasDescription", value)} /><Field label="Título das dúvidas" value={home.faqsTitle} multiline onChange={(value) => updateHome("faqsTitle", value)} /><Field label="Descrição das dúvidas" value={home.faqsDescription} multiline onChange={(value) => updateHome("faqsDescription", value)} /><Field label="Título do contato" value={home.contactTitle} onChange={(value) => updateHome("contactTitle", value)} /><Field label="Texto do contato" value={home.contactDescription} multiline onChange={(value) => updateHome("contactDescription", value)} /><Field label="Observação de localização" value={home.locationNote} onChange={(value) => updateHome("locationNote", value)} /><Field label="Nota de fontes" value={home.sourceNote} multiline onChange={(value) => updateHome("sourceNote", value)} /></div><div className="mt-7 border-t border-[#e5dfd3] pt-5"><h3 className="font-serif text-2xl">Compromissos</h3><div className="mt-4 grid gap-4 md:grid-cols-3">{home.commitmentPoints.map((point, index) => <div key={index} className="border border-[#d9d3c8] p-3"><Field label={`Título ${index + 1}`} value={point.title} onChange={(value) => updateHome("commitmentPoints", home.commitmentPoints.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item))} /><Field label="Texto" value={point.text} multiline onChange={(value) => updateHome("commitmentPoints", home.commitmentPoints.map((item, itemIndex) => itemIndex === index ? { ...item, text: value } : item))} /></div>)}</div></div><SaveButton saving={saving} label="Salvar textos da home" /></form> : null}
          {tab === "images" ? <form onSubmit={saveImages}><SectionTitle number="03" title="Imagens do site" description="Troque as imagens usadas na abertura, apresentação, compromisso, cabeçalho e rodapé." /><p className="mt-5 border-l-2 border-[#c3a468] bg-[#fbf8f0] p-4 text-sm leading-6 text-slate-600">Escolha uma imagem do computador em cada cartão. O arquivo é redimensionado para a web antes de ser salvo, preservando o carregamento do site. Depois de salvar, a imagem passa a aparecer automaticamente na área correspondente.</p><div className="mt-6 grid gap-5 md:grid-cols-2">{imageSlots.map((slot) => <ImageSlot key={slot.key} slot={slot} value={images[slot.key]} onChange={(value) => setImages((current) => ({ ...current, [slot.key]: value }))} onReset={() => setImages((current) => ({ ...current, [slot.key]: siteImageDefaults[slot.key] }))} />)}</div><SaveButton saving={saving} label="Salvar imagens do site" /></form> : null}
          {tab === "areas" && selectedArea ? <form onSubmit={saveHome}><SectionTitle number="04" title="Áreas de atuação" description="Edite cada título, resumo, requisitos e orientação exibidos na home e na página detalhada." /><div className="mt-6 grid gap-5 lg:grid-cols-[14rem_1fr]"><div className="max-h-[38rem] space-y-2 overflow-y-auto pr-1">{home.areas.map((area, index) => <button type="button" key={area.slug} onClick={() => setAreaIndex(index)} className={`w-full border p-3 text-left ${index === areaIndex ? "border-[#8d6b31] bg-[#fff9e8]" : "border-[#e5dfd3]"}`}><span className="text-[10px] font-bold text-[#8d6b31]">{area.number}</span><strong className="mt-1 block text-sm">{area.title}</strong></button>)}</div><div className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Título" value={selectedArea.title} onChange={(value) => updateArea({ title: value })} /><Field label="Título curto" value={selectedArea.shortTitle} onChange={(value) => updateArea({ shortTitle: value })} /><Field label="Resumo da home" value={selectedArea.summary} multiline onChange={(value) => updateArea({ summary: value })} /><Field label="Quem pode ter direito" value={selectedArea.who} multiline onChange={(value) => updateArea({ who: value })} /><Field label="Como podemos auxiliar" value={selectedArea.support} multiline onChange={(value) => updateArea({ support: value })} /><Field label="Requisitos (um por linha)" value={selectedArea.requirements.join("\n")} multiline onChange={(value) => updateArea({ requirements: value.split("\n").map((item) => item.trim()).filter(Boolean) })} /></div></div></div><SaveButton saving={saving} label="Salvar área" /></form> : null}
          {tab === "faq" && selectedFaq ? <form onSubmit={saveHome}><SectionTitle number="05" title="Dúvidas frequentes" description="Edite as perguntas e respostas exibidas na home." /><div className="mt-6 grid gap-5 lg:grid-cols-[14rem_1fr]"><div className="space-y-2">{home.faqs.map((faq, index) => <button type="button" key={index} onClick={() => setFaqIndex(index)} className={`w-full border p-3 text-left text-sm ${index === faqIndex ? "border-[#8d6b31] bg-[#fff9e8]" : "border-[#e5dfd3]"}`}>{faq.question}</button>)}</div><div className="grid gap-4"><Field label="Pergunta" value={selectedFaq.question} onChange={(value) => updateFaq({ question: value })} /><Field label="Resposta" value={selectedFaq.answer} multiline onChange={(value) => updateFaq({ answer: value })} /></div></div><SaveButton saving={saving} label="Salvar dúvida" /></form> : null}
          {tab === "blog" ? <BlogEditor selected={selected} setSelected={setSelected} articles={articles} selectedIndex={selectedIndex} saveArticle={saveArticle} saving={saving} updateSection={updateSection} /> : null}
          {tab === "comments" ? <CommentsEditor comments={comments} replyTarget={replyTarget} setReplyTarget={setReplyTarget} replyText={replyText} setReplyText={setReplyText} savingReply={savingReply} replyToComment={replyToComment} /> : null}
        </div>

      </div>
    </div>
  </main>;
}

function SectionTitle({ number, title, description }: { number: string; title: string; description: string }) { return <div className="border-b border-[#d9d3c8] pb-5"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b31]">{number} · Edição</p><h2 className="mt-2 font-serif text-3xl">{title}</h2><p className="mt-2 text-sm text-slate-500">{description}</p></div>; }
function SaveButton({ saving, label }: { saving: boolean; label: string }) { return <button type="submit" disabled={saving} className="mt-7 inline-flex items-center gap-2 bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {label}</button>; }
function BlogEditor({ selected, setSelected, articles, selectedIndex, saveArticle, saving, updateSection }: { selected: ManagedArticle | null; setSelected: (article: ManagedArticle | null) => void; articles: ManagedArticle[]; selectedIndex: number; saveArticle: (event: FormEvent) => Promise<void>; saving: boolean; updateSection: (index: number, value: BlogSection) => void }) { return <><SectionTitle number="06" title="Blog" description="Crie e edite todos os dados escritos dos artigos." /><div className="mt-6 grid gap-6 lg:grid-cols-[15rem_1fr]"><aside className="space-y-2"><button type="button" onClick={() => setSelected(initialArticle())} className="mb-2 inline-flex items-center gap-2 border border-[#0b1f3a] px-3 py-2 text-xs font-bold uppercase"><FilePlus2 size={15} /> Novo artigo</button>{articles.map((article) => <button type="button" key={article.id || article.slug} onClick={() => setSelected(article)} className={`w-full border p-3 text-left ${selectedIndex >= 0 && ((selected?.id && article.id === selected.id) || article.slug === selected?.slug) ? "border-[#8d6b31] bg-[#fff9e8]" : "border-[#e5dfd3]"}`}><span className="text-[10px] font-bold text-[#8d6b31]">{article.published ? "Publicado" : "Rascunho"}</span><strong className="mt-1 block text-sm">{article.title}</strong></button>)}</aside>{selected ? <form onSubmit={saveArticle} className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="Título" value={selected.title} onChange={(value) => setSelected({ ...selected, title: value })} /><Field label="Slug" value={selected.slug} onChange={(value) => setSelected({ ...selected, slug: value })} /><Field label="Categoria" value={selected.category} onChange={(value) => setSelected({ ...selected, category: value })} /><Field label="Data de publicação" value={selected.date} onChange={(value) => setSelected({ ...selected, date: value })} /><Field label="Tempo de leitura" value={selected.readTime} onChange={(value) => setSelected({ ...selected, readTime: value })} /><Field label="Resumo" value={selected.excerpt} multiline onChange={(value) => setSelected({ ...selected, excerpt: value })} /></div><div className="space-y-4 border-y border-[#e5dfd3] py-5"><div className="flex items-center justify-between"><h3 className="font-serif text-2xl">Seções do texto</h3><button type="button" onClick={() => setSelected({ ...selected, sections: [...selected.sections, { heading: "Nova seção", body: "<p>Escreva um parágrafo.</p>" }] })} className="text-xs font-bold uppercase text-[#735a2e]"><Plus size={15} className="inline" /> Adicionar</button></div>{selected.sections.map((section, index) => <div key={index} className="border border-[#d9d3c8] p-4"><div className="flex gap-3"><input value={section.heading} onChange={(event) => updateSection(index, { ...section, heading: event.target.value })} className="min-w-0 flex-1 border-b border-slate-300 px-1 py-2 font-serif text-xl outline-none" /><button type="button" onClick={() => setSelected({ ...selected, sections: selected.sections.filter((_, itemIndex) => itemIndex !== index) })} aria-label="Excluir seção"><Trash2 size={16} /></button></div><div className="mt-3"><RichTextEditor value={section.body} onChange={(html) => updateSection(index, { ...section, body: html })} /></div></div>)}</div><div className="grid gap-4 md:grid-cols-2"><Field label="Referência consultada" value={selected.sourceLabel} onChange={(value) => setSelected({ ...selected, sourceLabel: value })} /><Field label="Link da fonte" value={selected.sourceUrl} onChange={(value) => setSelected({ ...selected, sourceUrl: value })} /></div><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={selected.published} onChange={(event) => setSelected({ ...selected, published: event.target.checked })} /> Publicado no blog</label><SaveButton saving={saving} label="Salvar artigo" /></form> : <p className="border-l-2 border-[#c3a468] bg-[#fbf8f0] p-5 text-sm">Selecione um artigo para começar.</p>}</div></> }
function ImageSlot({ slot, value, onChange, onReset }: { slot: { key: SiteImageKey; label: string; description: string }; value: string; onChange: (value: string) => void; onReset: () => void }) {
  async function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { window.alert("Escolha um arquivo de imagem."); return; }
    if (file.size > 8 * 1024 * 1024) { window.alert("A imagem deve ter no máximo 8 MB."); return; }
    try { onChange(await resizeImage(file)); } catch (reason) { window.alert(reason instanceof Error ? reason.message : "Não foi possível carregar a imagem."); }
  }
  return <div className="overflow-hidden border border-[#d9d3c8] bg-[#fbf8f0]">
    <div className="flex aspect-[16/8] items-center justify-center overflow-hidden bg-[#e9e3d7]"><img src={value} alt={slot.label} className="h-full w-full object-cover" /></div>
    <div className="p-4"><h3 className="font-serif text-xl">{slot.label}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{slot.description}</p><div className="mt-4 flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center gap-2 bg-[#0b1f3a] px-3 py-2 text-xs font-bold text-white"><ImageIcon size={14} /> Escolher imagem<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { void handleFile(event.target.files?.[0]); event.target.value = ""; }} /></label><button type="button" onClick={onReset} className="border border-[#0b1f3a]/25 px-3 py-2 text-xs font-bold text-slate-600">Restaurar padrão</button></div></div>
  </div>;
}
function CommentsEditor({ comments, replyTarget, setReplyTarget, replyText, setReplyText, savingReply, replyToComment }: { comments: AdminComment[]; replyTarget: string | null; setReplyTarget: (id: string | null) => void; replyText: string; setReplyText: (value: string) => void; savingReply: boolean; replyToComment: (comment: AdminComment) => Promise<void> }) { return <><SectionTitle number="07" title="Comentários" description="Leia, abra a publicação e responda diretamente pelo painel." /><div className="mt-6 space-y-3">{comments.length ? comments.map((comment) => <article key={comment.id} className="border border-[#d9d3c8] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>{comment.name}</strong><p className="mt-1 text-xs text-slate-500">{comment.email} · {comment.articleSlug}</p><p className="mt-3 text-sm leading-6">{comment.message}</p></div><div className="flex gap-3"><a href={`/blog/${comment.articleSlug}#comentarios`} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#8d6b31]">Abrir publicação</a><button type="button" onClick={() => setReplyTarget(replyTarget === comment.id ? null : comment.id)} className="text-xs font-bold text-[#8d6b31]">Responder</button></div></div>{replyTarget === comment.id ? <div className="mt-4 border-t border-[#e5dfd3] pt-4"><textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={4} placeholder="Escreva sua resposta..." className="w-full border border-slate-300 p-3 text-sm" /><button type="button" disabled={savingReply} onClick={() => void replyToComment(comment)} className="mt-2 bg-[#0b1f3a] px-4 py-2 text-xs font-bold text-white">{savingReply ? "Enviando..." : "Publicar resposta e avisar por e-mail"}</button></div> : null}</article>) : <p className="border border-dashed border-[#d9d3c8] p-6 text-sm text-slate-500">Ainda não há comentários recebidos.</p>}</div></> }
