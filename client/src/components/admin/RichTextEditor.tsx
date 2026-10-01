import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Highlighter, Palette, Heading3, Heading4,
  List, ListOrdered, Quote, LinkIcon, ImageIcon, Undo2, Redo2, Eraser, SmilePlus, Upload,
} from "lucide-react";

const TEXT_COLORS = [
  { label: "Padrão", value: "" },
  { label: "Azul-marinho", value: "#0b1f3a" },
  { label: "Dourado", value: "#a47a29" },
  { label: "Vermelho", value: "#a3402f" },
  { label: "Verde", value: "#3d6b4c" },
  { label: "Azul", value: "#245b8f" },
  { label: "Roxo", value: "#69458f" },
  { label: "Cinza", value: "#667080" },
];

const HIGHLIGHT_COLORS = [
  { label: "Dourado claro", value: "#f7e7c1" },
  { label: "Amarelo", value: "#fff3a3" },
  { label: "Azul claro", value: "#d9ecff" },
  { label: "Verde claro", value: "#dff1e2" },
  { label: "Rosa claro", value: "#ffe0e5" },
];

const SYMBOLS = ["•", "→", "➜", "✓", "⚖", "§", "★", "※"];

function ToolbarButton({ active, onClick, label, children }: { active?: boolean; onClick?: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => { event.preventDefault(); onClick?.(); }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center border transition ${active ? "border-[#8d6b31] bg-[#fff3d6] text-[#5e451d]" : "border-slate-300 text-slate-600 hover:border-[#8d6b31] hover:text-[#5e451d]"}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link (URL completa, começando com https://)", previous || "https://");
    if (url === null) return;
    if (!url.trim()) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function addImage() {
    const url = window.prompt("Cole a URL direta da imagem ou GIF (JPG, PNG, WEBP ou GIF)");
    if (!url?.trim()) return;
    const alt = window.prompt("Texto alternativo da imagem (opcional)", "Imagem ilustrativa do artigo") || "";
    editor.chain().focus().setImage({ src: url.trim(), alt: alt.trim() }).run();
  }

  function addLocalImage(file: File) {
    if (!file.type.startsWith("image/")) {
      window.alert("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert("A imagem deve ter no máximo 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") editor.chain().focus().setImage({ src: reader.result, alt: file.name }).run();
    };
    reader.readAsDataURL(file);
  }

  function addSymbol(symbol: string) {
    editor.chain().focus().insertContent(symbol).run();
  }

  return (
    <div className="sticky top-0 z-10 flex max-h-28 flex-wrap items-center gap-1 overflow-y-auto border border-b-0 border-slate-300 bg-[#fbf8f0] p-2">
      <ToolbarButton label="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></ToolbarButton>
      <ToolbarButton label="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></ToolbarButton>
      <ToolbarButton label="Sublinhado" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={15} /></ToolbarButton>
      <span className="mx-1 h-6 w-px bg-slate-300" />
      <ToolbarButton label="Subtítulo" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></ToolbarButton>
      <ToolbarButton label="Subtítulo menor" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 size={15} /></ToolbarButton>
      <span className="mx-1 h-6 w-px bg-slate-300" />
      <ToolbarButton label="Lista com marcadores" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></ToolbarButton>
      <ToolbarButton label="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></ToolbarButton>
      <ToolbarButton label="Citação" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></ToolbarButton>
      <span className="mx-1 h-6 w-px bg-slate-300" />
      <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}><LinkIcon size={15} /></ToolbarButton>
      <ToolbarButton label="Inserir imagem ou GIF" onClick={addImage}><ImageIcon size={15} /></ToolbarButton>
      <ToolbarButton label="Escolher imagem ou GIF do computador" onClick={() => fileInputRef.current?.click()}><Upload size={15} /></ToolbarButton>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) addLocalImage(file); event.target.value = ""; }} />
      <div className="group relative">
        <ToolbarButton label="Inserir símbolo ou seta"><SmilePlus size={15} /></ToolbarButton>
        <div className="absolute left-0 top-full z-20 hidden grid-cols-4 gap-1 border border-slate-300 bg-white p-1.5 shadow-lg group-focus-within:grid group-hover:grid">
          {SYMBOLS.map((symbol) => <button key={symbol} type="button" title={`Inserir ${symbol}`} onMouseDown={(event) => { event.preventDefault(); addSymbol(symbol); }} className="flex h-7 w-7 items-center justify-center border border-slate-200 text-base hover:border-[#8d6b31] hover:bg-[#fff3d6]">{symbol}</button>)}
        </div>
      </div>
      <div className="group relative">
        <ToolbarButton label="Mais cores para o texto" active={Boolean(editor.getAttributes("textStyle").color)}><Palette size={15} /></ToolbarButton>
        <div className="absolute left-0 top-full z-20 hidden grid-cols-4 gap-1 border border-slate-300 bg-white p-1.5 shadow-lg group-focus-within:grid group-hover:grid">
          {TEXT_COLORS.map((color) => <button key={color.label} type="button" title={color.label} onMouseDown={(event) => { event.preventDefault(); if (color.value) editor.chain().focus().setColor(color.value).run(); else editor.chain().focus().unsetColor().run(); }} className="h-6 w-6 rounded-full border border-slate-300" style={{ backgroundColor: color.value || "#ffffff" }} />)}
        </div>
      </div>
      <div className="group relative">
        <ToolbarButton label="Mais cores de marca-texto" active={editor.isActive("highlight")}><Highlighter size={15} /></ToolbarButton>
        <div className="absolute left-0 top-full z-20 hidden grid-cols-4 gap-1 border border-slate-300 bg-white p-1.5 shadow-lg group-focus-within:grid group-hover:grid">
          {HIGHLIGHT_COLORS.map((color) => <button key={color.label} type="button" title={color.label} onMouseDown={(event) => { event.preventDefault(); editor.chain().focus().toggleHighlight({ color: color.value }).run(); }} className="h-6 w-6 rounded-full border border-slate-300" style={{ backgroundColor: color.value }} />)}
          <button type="button" title="Remover marca-texto" onMouseDown={(event) => { event.preventDefault(); editor.chain().focus().unsetHighlight().run(); }} className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[10px]">✕</button>
        </div>
      </div>
      <span className="mx-1 h-6 w-px bg-slate-300" />
      <ToolbarButton label="Limpar formatação" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><Eraser size={15} /></ToolbarButton>
      <ToolbarButton label="Desfazer" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={15} /></ToolbarButton>
      <ToolbarButton label="Refazer" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={15} /></ToolbarButton>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [3, 4] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      ImageExtension.configure({ allowBase64: true, HTMLAttributes: { class: "article-image" } }),
      Link.configure({ openOnClick: false, autolink: false }),
      Placeholder.configure({ placeholder: placeholder || "Escreva o conteúdo desta seção…" }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    editorProps: { attributes: { class: "rich-editor-content" } },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div className="rich-editor">
      <Toolbar editor={editor} />
      <div className="max-h-[32rem] min-h-40 overflow-y-auto border border-slate-300 bg-white focus-within:border-[#8d6b31]">
        <EditorContent editor={editor} className="p-3 text-sm leading-6 outline-none" />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">Use a rolagem interna para textos longos. O ícone de upload escolhe uma imagem ou GIF do computador; o ícone de imagem continua aceitando URLs.</p>
    </div>
  );
}
