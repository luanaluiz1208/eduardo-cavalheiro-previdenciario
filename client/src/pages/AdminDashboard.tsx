/** Direção visual: Arquivo de Confiança — administração em blocos de arquivo, com ordem, hierarquia e ações explícitas. */
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ExternalLink, FilePlus2, Loader2, LogOut, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { siteContentDefaults, type SiteContentKey, type SiteContentValues } from "@/data/siteContent";
import { blogArticles, type BlogArticle, type BlogSection } from "@/data/blog";
import { adminRequest } from "@/lib/adminApi";
import RichTextEditor from "@/components/admin/RichTextEditor";

type ManagedArticle = BlogArticle & { id?: string; published: boolean; featured: boolean };
type AdminComment = { id: string; articleSlug: string; name: string; message: string; createdAt: string };

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

function initialArticle(): ManagedArticle {
  return { slug: "novo-artigo", category: "Previdência Social", title: "Novo artigo", excerpt: "Escreva um resumo claro para orientar a leitura.", readTime: "5 min de leitura", date: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()), featured: false, published: true, sections: [{ heading: "Introdução", body: "<p>Escreva aqui o primeiro parágrafo do artigo.</p>" }], sourceLabel: "Fonte oficial", sourceUrl: "" };
}

function normalizeStaticArticle(article: BlogArticle): ManagedArticle {
  return { ...article, published: article.published !== false, featured: Boolean(article.featured) };
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<SiteContentValues>(siteContentDefaults);
  const [articles, setArticles] = useState<ManagedArticle[]>(() => blogArticles.map(normalizeStaticArticle));
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [selected, setSelected] = useState<ManagedArticle | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingContent, setSavingContent] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const session = await adminRequest<{ authenticated: boolean }>("/api/auth/session");
        if (!session.authenticated) { setLocation("/admin/login"); return; }
        const [contentResponse, articleResponse] = await Promise.all([
          adminRequest<{ content: Partial<SiteContentValues> }>("/api/content"),
          adminRequest<{ articles: ManagedArticle[] }>("/api/articles"),
        ]);
        const commentResponse = await adminRequest<{ comments: AdminComment[] }>("/api/comments");
        if (!active) return;
        setContent((current) => ({ ...current, ...contentResponse.content }));
        setComments(commentResponse.comments || []);
        if (articleResponse.articles.length) {
          const storedSlugs = new Set(articleResponse.articles.map((article) => article.slug));
          setArticles([...articleResponse.articles, ...blogArticles.map(normalizeStaticArticle).filter((article) => !storedSlugs.has(article.slug))]);
        }
      } catch {
        setLocation("/admin/login");
      } finally {
        if (active) setChecking(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [setLocation]);

  const selectedIndex = useMemo(() => selected ? articles.findIndex((article) => (selected.id && article.id === selected.id) || article.slug === selected.slug) : -1, [articles, selected]);

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingContent(true); setError(""); setMessage("");
    try {
      await adminRequest("/api/content", { method: "PUT", body: JSON.stringify({ content }) });
      setMessage("Informações institucionais salvas. A página pública será atualizada automaticamente.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível salvar o conteúdo."); }
    finally { setSavingContent(false); }
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setSavingArticle(true); setError(""); setMessage("");
    try {
      const path = selected.id ? `/api/articles/${selected.id}` : "/api/articles";
      const method = selected.id ? "PUT" : "POST";
      const response = await adminRequest<{ article: ManagedArticle }>(path, { method, body: JSON.stringify({ article: selected }) });
      setArticles((current) => {
        const index = current.findIndex((article) => (response.article.id && article.id === response.article.id) || article.slug === selected.slug);
        return index >= 0 ? current.map((article, itemIndex) => itemIndex === index ? response.article : article) : [response.article, ...current];
      });
      setSelected(response.article);
      setMessage("Artigo salvo. Use a publicação para controlar sua aparição no blog público.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível salvar o artigo."); }
    finally { setSavingArticle(false); }
  }

  async function logout() {
    await adminRequest("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    setLocation("/admin/login");
  }

  function updateSection(index: number, value: BlogSection) {
    if (!selected) return;
    setSelected({ ...selected, sections: selected.sections.map((section, itemIndex) => itemIndex === index ? value : section) });
  }

  if (checking) return <main className="flex min-h-screen items-center justify-center bg-[#f7f4ed] text-[#0b1f3a]"><Loader2 className="animate-spin" size={26} /><span className="ml-3 text-sm">Verificando acesso administrativo…</span></main>;

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-[#0b1f3a]">
      <header className="border-b border-[#c3a468]/60 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d6b31]">Arquivo de Confiança · Administração</p><h1 className="mt-1 font-serif text-3xl leading-none">Painel do escritório</h1></div>
          <div className="flex items-center gap-3"><Link href="/" target="_blank" className="inline-flex items-center gap-2 border border-[#0b1f3a]/25 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] transition hover:bg-[#f7f4ed]"><ExternalLink size={14} /> Ver site</Link><button type="button" onClick={logout} className="inline-flex items-center gap-2 border border-transparent px-2 py-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-600 hover:text-[#0b1f3a]"><LogOut size={14} /> Sair</button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-8">
          {message ? <p className="border-l-2 border-[#8d6b31] bg-[#fff7df] px-4 py-3 text-sm text-[#5e451d]">{message}</p> : null}
          {error ? <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
          <section className="border border-[#c3a468]/60 bg-[#fffaf0] p-5 shadow-[8px_8px_0_rgba(195,164,104,0.08)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5dfd3] pb-4">
              <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b31]">03 · Caixa de entrada</p><h2 className="mt-2 font-serif text-3xl">Comentários recebidos</h2></div>
              <span className="bg-[#0b1f3a] px-3 py-1 text-sm font-bold text-white">{comments.length} {comments.length === 1 ? "comentário recebido" : "comentários recebidos"}</span>
            </div>
            {comments.length ? <div className="mt-4 space-y-2">{comments.slice(0, 8).map((comment) => <a key={comment.id} href={`/blog/${comment.articleSlug}#comentarios`} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-l-2 border-[#c3a468] bg-white px-4 py-3 transition hover:bg-[#fff7df]"><span className="min-w-0"><strong className="block truncate text-sm">{comment.name}</strong><span className="mt-1 block truncate text-xs text-slate-500">Comentou em “{comment.articleSlug}”</span></span><span className="shrink-0 text-xs font-bold text-[#8d6b31]">Ver comentário →</span></a>)}</div> : <p className="mt-4 text-sm leading-6 text-slate-600">Ainda não há comentários recebidos. Quando alguém comentar em um artigo, a notificação aparecerá aqui.</p>}
          </section>
          <section className="border border-[#d9d3c8] bg-white p-5 shadow-[8px_8px_0_rgba(195,164,104,0.08)] sm:p-7">
            <div className="flex items-end justify-between gap-4 border-b border-[#d9d3c8] pb-5"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b31]">01 · Dados do escritório</p><h2 className="mt-2 font-serif text-3xl">Informações institucionais</h2></div></div>
            <form onSubmit={saveContent} className="mt-6 grid gap-5 md:grid-cols-2">
              {contentFields.map((field) => <label key={field.key} className={`block text-sm font-semibold ${field.multiline ? "md:col-span-2" : ""}`}><span>{field.label}</span><small className="mt-1 block font-normal leading-5 text-slate-500">{field.description}</small>{field.multiline ? <textarea value={content[field.key]} onChange={(event) => setContent({ ...content, [field.key]: event.target.value })} className="mt-3 min-h-28 w-full border border-slate-300 p-3 text-sm font-normal outline-none focus:border-[#8d6b31] focus:ring-2 focus:ring-[#c3a468]/30" /> : <input value={content[field.key]} onChange={(event) => setContent({ ...content, [field.key]: event.target.value })} className="mt-3 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31] focus:ring-2 focus:ring-[#c3a468]/30" />}</label>)}
              <div className="md:col-span-2"><button type="submit" disabled={savingContent} className="inline-flex items-center gap-2 bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183a64] disabled:opacity-60">{savingContent ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar informações</button></div>
            </form>
          </section>
          <section className="border border-[#d9d3c8] bg-white p-5 shadow-[8px_8px_0_rgba(195,164,104,0.08)] sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d9d3c8] pb-5"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b31]">02 · Arquivo editorial</p><h2 className="mt-2 font-serif text-3xl">{selected ? "Editar artigo" : "Selecione ou crie um artigo"}</h2></div><button type="button" onClick={() => setSelected(initialArticle())} className="inline-flex items-center gap-2 border border-[#0b1f3a] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition hover:bg-[#0b1f3a] hover:text-white"><FilePlus2 size={15} /> Novo artigo</button></div>
            {selected ? <form onSubmit={saveArticle} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2"><label className="block text-sm font-semibold">Título<input required value={selected.title} onChange={(event) => setSelected({ ...selected, title: event.target.value })} className="mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label><label className="block text-sm font-semibold">Slug<input required value={selected.slug} onChange={(event) => setSelected({ ...selected, slug: event.target.value })} className="mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label><label className="block text-sm font-semibold">Categoria<input required value={selected.category} onChange={(event) => setSelected({ ...selected, category: event.target.value })} className="mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label><label className="block text-sm font-semibold">Tempo de leitura<input required value={selected.readTime} onChange={(event) => setSelected({ ...selected, readTime: event.target.value })} className="mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label></div>
              <label className="block text-sm font-semibold">Resumo<textarea required value={selected.excerpt} onChange={(event) => setSelected({ ...selected, excerpt: event.target.value })} className="mt-2 min-h-24 w-full border border-slate-300 p-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label>
              <div className="space-y-4 border-y border-[#e5dfd3] py-5"><div className="flex items-center justify-between gap-4"><h3 className="font-serif text-2xl">Seções do texto</h3><button type="button" onClick={() => setSelected({ ...selected, sections: [...selected.sections, { heading: "Nova seção", body: "<p>Escreva um parágrafo.</p>" }] })} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#735a2e]"><Plus size={15} /> Adicionar seção</button></div>{selected.sections.map((section, index) => <div key={index} className="border border-[#d9d3c8] p-4"><div className="flex items-center gap-3"><input value={section.heading} onChange={(event) => updateSection(index, { ...section, heading: event.target.value })} className="min-w-0 flex-1 border-b border-slate-300 bg-transparent px-1 py-2 font-serif text-xl outline-none focus:border-[#8d6b31]" /><button type="button" onClick={() => setSelected({ ...selected, sections: selected.sections.filter((_, itemIndex) => itemIndex !== index) })} className="p-2 text-slate-500 hover:text-red-700" aria-label="Excluir seção"><Trash2 size={16} /></button></div><div className="mt-3"><RichTextEditor value={section.body} onChange={(html) => updateSection(index, { ...section, body: html })} /></div></div>)}</div>
              <div className="grid gap-5 md:grid-cols-2"><label className="block text-sm font-semibold">Referência consultada<input value={selected.sourceLabel} onChange={(event) => setSelected({ ...selected, sourceLabel: event.target.value })} className="mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label><label className="block text-sm font-semibold">Link da fonte<input type="url" value={selected.sourceUrl} onChange={(event) => setSelected({ ...selected, sourceUrl: event.target.value })} className="mt-2 w-full border border-slate-300 px-3 py-3 text-sm font-normal outline-none focus:border-[#8d6b31]" /></label></div>
              <div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={selected.published} onChange={(event) => setSelected({ ...selected, published: event.target.checked })} /> Publicado no blog</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={selected.featured} onChange={(event) => setSelected({ ...selected, featured: event.target.checked })} /> Destacar no blog</label></div>
              <button type="submit" disabled={savingArticle} className="inline-flex items-center gap-2 bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183a64] disabled:opacity-60">{savingArticle ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar artigo</button>
            </form> : <div className="mt-6 border-l-2 border-[#c3a468] bg-[#fbf8f0] p-5 text-sm leading-6 text-slate-600">Use a lista de artigos ao lado para revisar um conteúdo existente ou crie uma nova publicação.</div>}
          </section>
        </div>
        <aside className="h-fit border border-[#d9d3c8] bg-white p-5 shadow-[8px_8px_0_rgba(195,164,104,0.08)] lg:sticky lg:top-5"><div className="flex items-center justify-between gap-3 border-b border-[#d9d3c8] pb-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d6b31]">Caderno de posts</p><h2 className="mt-1 font-serif text-2xl">Artigos</h2></div><span className="text-sm text-slate-500">{articles.length}</span></div><div className="mt-4 space-y-2">{articles.map((article) => <button type="button" key={article.id || article.slug} onClick={() => setSelected(article)} className={`w-full border p-3 text-left transition ${selectedIndex >= 0 && ((selected?.id && article.id === selected.id) || article.slug === selected?.slug) ? "border-[#8d6b31] bg-[#fff9e8]" : "border-[#e5dfd3] hover:border-[#c3a468]"}`}><span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8d6b31]"><span>{article.published ? "Publicado" : "Rascunho"}</span>{article.featured ? <span>Em destaque</span> : null}</span><span className="mt-2 block font-serif text-lg leading-tight">{article.title}</span><span className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Pencil size={12} /> Editar</span></button>)}</div></aside>
      </div>
    </main>
  );
}
