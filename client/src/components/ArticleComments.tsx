import { FormEvent, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function ArticleComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // campo-armadilha (honeypot), fica oculto para pessoas
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    let active = true;
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { comments?: Comment[] } | null) => {
        if (!active) return;
        setComments(payload?.comments || []);
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, email, message, website }),
      });
      if (!response.ok) throw new Error("falha");
      const payload = await response.json() as { comment: Comment | null };
      if (payload.comment) setComments((current) => [...current, payload.comment as Comment]);
      setName("");
      setEmail("");
      setMessage("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="comentarios" className="article-comments">
      <p className="eyebrow"><span /> Comentários {comments.length > 0 ? `(${comments.length})` : ""}</p>
      <h2>O que você achou deste artigo?</h2>

      {!loading && comments.length === 0 && (
        <p className="comments-empty">Seja a primeira pessoa a comentar.</p>
      )}

      {comments.length > 0 && (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="comment-head">
                <strong>{comment.name}</strong>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              <p>{comment.message}</p>
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="form-heading"><MessageCircle size={18} /><p>Deixe seu comentário</p></div>
        <label>
          Nome
          <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" maxLength={120} />
        </label>
        <label>
          E-mail
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" maxLength={254} autoComplete="email" />
          <small className="comment-email-note">Usaremos apenas para avisar quando houver uma resposta.</small>
        </label>
        {/* Campo invisível para humanos; se vier preenchido, tratamos como spam automatizado. */}
        <label className="comment-honeypot" aria-hidden="true">
          Deixe em branco
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
        </label>
        <label>
          Comentário
          <textarea required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escreva seu comentário" rows={4} maxLength={2000} />
        </label>
        <button type="submit" className="button button-navy form-submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Publicar comentário"}
        </button>
        {status === "sent" && <p className="form-message">Comentário publicado. Obrigado por participar!</p>}
        {status === "error" && <p className="form-message form-message-error">Não foi possível publicar agora. Tente novamente em instantes.</p>}
      </form>
    </section>
  );
}
