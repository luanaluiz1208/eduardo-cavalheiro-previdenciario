import { useEffect } from "react";
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
  List, ListOrdered, Quote, LinkIcon, ImageIcon, Undo2, Redo2, Eraser,
} from "lucide-react";

const TEXT_COLORS = [
  { label: "Padrão", value: "" },
  { label: "Dourado", value: "#a47a29" },
  { label: "Vermelho", value: "#a3402f" },
  { label: "Verde", value: "#3d6b4c" },
];

const HIGHLIGHT_COLORS = [
  { label: "Dourado claro", value: "#f7e7c1" },
  { label: "Amarelo", value: "#fff3a3" },
];

function ToolbarButton({ active, onClick, label, children }: { active?: boolean; onClick?: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(event) => { event.preventDefault(); onClick?.(); }}
      className={`inline-flex h-8 w-8 items-center justify-center border transition ${active ? "border-[#8d6b31] bg-[#fff3d6] text-[#5e451d]" : "border-slate-300 text-slate-600 hover:border-[#8d6b31] hover:text-[#5e451d]"}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link (URL completa, começando com https://)", previous || "https://");
    if (url === null) return;
    if (!url.trim()) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function addImage() {
    const url = window.prompt("URL da imagem (link direto para o arquivo .jpg/.png/.webp)");
    if (url && url.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border border-b-0 border-slate-300 bg-[#fbf8f0] p-2">
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
      <ToolbarButton label="Inserir imagem" onClick={addImage}><ImageIcon size={15} /></ToolbarButton>
      <span className="mx-1 h-6 w-px bg-slate-300" />
      <div className="group relative">
        <ToolbarButton label="Cor do texto" active={Boolean(editor.getAttributes("textStyle").color)}><Palette size={15} /></ToolbarButton>
        <div className="absolute left-0 top-full z-10 hidden gap-1 border border-slate-300 bg-white p-1.5 group-focus-within:flex group-hover:flex">
          {TEXT_COLORS.map((color) => (
            <button key={color.label} type="button" title={color.label} onMouseDown={(event) => { event.preventDefault(); if (color.value) editor.chain().focus().setColor(color.value).run(); else editor.chain().focus().unsetColor().run(); }} className="h-6 w-6 rounded-full border border-slate-300" style={{ backgroundColor: color.value || "#0b1f3a" }} />
          ))}
        </div>
      </div>
      <div className="group relative">
        <ToolbarButton label="Grifar (marca-texto)" active={editor.isActive("highlight")}><Highlighter size={15} /></ToolbarButton>
        <div className="absolute left-0 top-full z-10 hidden gap-1 border border-slate-300 bg-white p-1.5 group-focus-within:flex group-hover:flex">
          {HIGHLIGHT_COLORS.map((color) => (
            <button key={color.label} type="button" title={color.label} onMouseDown={(event) => { event.preventDefault(); editor.chain().focus().toggleHighlight({ color: color.value }).run(); }} className="h-6 w-6 rounded-full border border-slate-300" style={{ backgroundColor: color.value }} />
          ))}
          <button type="button" title="Remover grifo" onMouseDown={(event) => { event.preventDefault(); editor.chain().focus().unsetHighlight().run(); }} className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[10px]">✕</button>
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
      ImageExtension.configure({ HTMLAttributes: { class: "article-image" } }),
      Link.configure({ openOnClick: false, autolink: false }),
      Placeholder.configure({ placeholder: placeholder || "Escreva o conteúdo desta seção…" }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    editorProps: {
      attributes: { class: "rich-editor-content" },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div className="rich-editor">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-40 w-full border border-slate-300 bg-white p-3 text-sm leading-6 outline-none focus-within:border-[#8d6b31]" />
    </div>
  );
}
