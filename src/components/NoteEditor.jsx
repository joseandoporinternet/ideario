import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { uploadImage } from '../services/pocketbase';

const AUTOSAVE_DELAY = 1200; // ms

const NoteEditor = ({ note, onSave }) => {
  const [title, setTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const autosaveTimeout = useRef(null);

  // Solo actualiza el contenido/título local cuando cambia la nota seleccionada
  useEffect(() => {
    setTitle(note?.title || '');
    setLocalContent(note?.content || '');
    if (editor) {
      editor.commands.setContent(note?.content || '');
    }
    // eslint-disable-next-line
  }, [note?.id]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: 'notion-list' } },
        orderedList: { HTMLAttributes: { class: 'notion-ordered-list' } },
        blockquote: { HTMLAttributes: { class: 'notion-quote' } },
        codeBlock: { HTMLAttributes: { class: 'notion-code-block' } },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'notion-image' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'notion-link' },
      }),
    ],
    content: localContent,
    editorProps: {
      attributes: {
        class: 'notion-editor',
        spellCheck: 'true',
        style: 'min-height: 400px; outline: none; border: none;',
      },
    },
    onUpdate({ editor }) {
      setLocalContent(editor.getHTML());
    },
  });

  // Guardado automático solo cuando cambia el título o el contenido local
  useEffect(() => {
    if (!note) return;
    if (!editor) return;

    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);

    autosaveTimeout.current = setTimeout(() => {
      setIsSaving(true);
      onSave({ title, content: editor.getHTML() }).finally(() => setIsSaving(false));
    }, AUTOSAVE_DELAY);

    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
    // eslint-disable-next-line
  }, [title, localContent, note?.id]);

  // Subida de imagen a PocketBase
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !note?.id) return;

    try {
      const url = await uploadImage(file, note.id);
      // Inserta la imagen en la posición actual del cursor
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      alert('Error subiendo imagen: ' + error.message);
    }
  };

  if (!note) {
    return (
      <div className="noteeditor-empty">
        <div className="noteeditor-empty-icon">
          <span>✨</span>
        </div>
        <h3 className="noteeditor-empty-title">Tu espacio creativo</h3>
        <p className="noteeditor-empty-desc">Selecciona una nota o crea una nueva</p>
        <p className="noteeditor-empty-hint">Escribe, organiza y da vida a tus ideas</p>
      </div>
    );
  }

  return (
    <div className="noteeditor-main">
      {/* Título */}
      <div className="noteeditor-titlebar">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Sin título"
          className="noteeditor-title"
          maxLength={120}
          autoComplete="off"
        />
        {isSaving && <span className="noteeditor-saving">Guardando...</span>}
      </div>

      {/* Toolbar */}
      {editor && (
        <div className="noteeditor-toolbar">
          <button
            type="button"
            className={editor.isActive('bold') ? 'active' : ''}
            title="Negrita"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={editor.isActive('italic') ? 'active' : ''}
            title="Cursiva"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className={editor.isActive('code') ? 'active' : ''}
            title="Código"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            {'</>'}
          </button>
          <span className="noteeditor-toolbar-divider" />
          <button
            type="button"
            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
            title="Encabezado 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </button>
          <button
            type="button"
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Encabezado 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type="button"
            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
            title="Encabezado 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </button>
          <span className="noteeditor-toolbar-divider" />
          <button
            type="button"
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="Lista"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Lista
          </button>
          <button
            type="button"
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Lista numerada"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. Lista
          </button>
          <span className="noteeditor-toolbar-divider" />
          <button
            type="button"
            className={editor.isActive('blockquote') ? 'active' : ''}
            title="Cita"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            💬
          </button>
          <button
            type="button"
            className={editor.isActive('codeBlock') ? 'active' : ''}
            title="Bloque de código"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            📋
          </button>
          <button
            type="button"
            className={editor.isActive('link') ? 'active' : ''}
            title="Enlace"
            onClick={() => {
              const url = window.prompt('URL del enlace:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
          >
            🔗
          </button>
          <label className="noteeditor-toolbar-imgbtn" title="Subir imagen">
            🖼️
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}

      {/* Editor */}
      <div className="noteeditor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteEditor;