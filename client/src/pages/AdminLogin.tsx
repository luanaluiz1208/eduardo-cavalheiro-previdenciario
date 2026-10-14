import { type FormEvent, useState } from "react";
import { ArrowLeft, KeyRound, Link as LinkIcon, Loader2, LockKeyhole, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { adminRequest } from "@/lib/adminApi";
import { whatsappLink } from "@/data/areas";

type Mode = "login" | "email" | "phone";
const inputClass = "mt-2 w-full rounded-none border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8d6b31] focus:ring-2 focus:ring-[#c3a468]/30";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    try { await adminRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); setLocation("/admin"); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível entrar no painel."); } finally { setLoading(false); }
  }
  async function handleEmailRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    try { const response = await adminRequest<{ message: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ action: "forgot-password", email }) }); setNotice(response.message); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível solicitar a recuperação."); } finally { setLoading(false); }
  }
  const phoneMessage = `Olá. Sou o responsável pelo painel administrativo e preciso recuperar o acesso. Meu telefone para confirmação é ${phone || "[informe seu telefone]"}.`;

  return <main className="min-h-screen bg-[#f7f4ed] px-4 py-8 text-[#0b1f3a] sm:px-6 sm:py-12"><div className="mx-auto max-w-md"><Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#735a2e] transition-opacity hover:opacity-70"><ArrowLeft size={15} /> Voltar ao site</Link><section className="mt-8 border border-[#c3a468]/60 bg-white p-7 shadow-[12px_12px_0_rgba(195,164,104,0.12)] sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d6b31]">Acesso do escritório</p><h1 className="mt-3 font-serif text-4xl leading-none text-[#0b1f3a]">{mode === "login" ? "Painel editorial" : "Recuperar acesso"}</h1><p className="mt-4 text-sm leading-6 text-slate-600">{mode === "login" ? "Atualize as informações do escritório e organize as publicações do blog em um único local." : mode === "email" ? "Enviaremos um link temporário para o e-mail de login cadastrado." : "Por segurança, a recuperação por telefone é feita em uma conversa de confirmação pelo WhatsApp."}</p>
    {mode === "login" ? <form onSubmit={handleLogin} className="mt-8 space-y-5"><label className="block text-sm font-semibold">E-mail administrativo<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label><label className="block text-sm font-semibold">Senha<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></label>{error ? <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}<button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? <Loader2 size={17} className="animate-spin" /> : <LockKeyhole size={17} />} {loading ? "Verificando acesso" : "Entrar no painel"}</button><div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-[#e5dfd3] pt-5 text-xs font-bold text-[#735a2e]"><button type="button" onClick={() => { setMode("email"); setError(""); }} className="inline-flex items-center gap-1 hover:underline"><KeyRound size={14} /> Esqueci a senha</button><button type="button" onClick={() => { setMode("phone"); setError(""); }} className="inline-flex items-center gap-1 hover:underline"><MessageCircle size={14} /> Recuperar pelo telefone</button></div></form> : null}
    {mode === "email" ? <form onSubmit={handleEmailRecovery} className="mt-8 space-y-5"><label className="block text-sm font-semibold">E-mail de login<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} /></label>{notice ? <p className="border-l-2 border-[#8d6b31] bg-[#fff7df] px-3 py-2 text-sm text-[#5e451d]">{notice}</p> : null}{error ? <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}<button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? <Loader2 size={17} className="animate-spin" /> : <KeyRound size={17} />} {loading ? "Enviando instruções" : "Enviar link por e-mail"}</button><button type="button" onClick={() => setMode("login")} className="w-full text-xs font-bold text-[#735a2e] hover:underline">Voltar para o login</button></form> : null}
    {mode === "phone" ? <div className="mt-8 space-y-5"><label className="block text-sm font-semibold">Telefone para confirmação<input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(00) 00000-0000" className={inputClass} /></label><a href={whatsappLink(phoneMessage)} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 bg-[#1b8654] px-4 py-3 text-sm font-bold text-white"><MessageCircle size={17} /> Solicitar recuperação pelo WhatsApp</a><p className="text-xs leading-5 text-slate-500">A confirmação pelo telefone é manual para evitar que outra pessoa altere sua senha. Após confirmar sua identidade, o acesso poderá ser redefinido.</p><button type="button" onClick={() => setMode("login")} className="w-full text-xs font-bold text-[#735a2e] hover:underline">Voltar para o login</button></div> : null}
  </section></div></main>;
}
