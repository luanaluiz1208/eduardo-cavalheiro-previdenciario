/** Direção visual: Arquivo de Confiança — acesso administrativo discreto, protegido e sem expor dados públicos. */
import { type FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, LockKeyhole, Loader2 } from "lucide-react";
import { adminRequest } from "@/lib/adminApi";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setLocation("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar no painel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ed] px-4 py-8 text-[#0b1f3a] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#735a2e] transition-opacity hover:opacity-70"><ArrowLeft size={15} /> Voltar ao site</Link>
        <section className="mt-8 border border-[#c3a468]/60 bg-white p-7 shadow-[12px_12px_0_rgba(195,164,104,0.12)] sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d6b31]">Acesso do escritório</p>
          <h1 className="mt-3 font-serif text-4xl leading-none text-[#0b1f3a]">Painel editorial</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">Atualize as informações do escritório e organize as publicações do blog em um único local.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold">E-mail administrativo<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-none border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8d6b31] focus:ring-2 focus:ring-[#c3a468]/30" /></label>
            <label className="block text-sm font-semibold">Senha<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-none border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#8d6b31] focus:ring-2 focus:ring-[#c3a468]/30" /></label>
            {error ? <p role="alert" className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#183a64] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <Loader2 size={17} className="animate-spin" /> : <LockKeyhole size={17} />} {loading ? "Verificando acesso" : "Entrar no painel"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
