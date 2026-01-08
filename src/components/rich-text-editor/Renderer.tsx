import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapRendererProps {
  content: string; // html content
  className?: string; // optional classname
}

/**
 * Read-only TipTap renderer for displaying rich text content (articles, posts, etc.)
 * Safely re-renders when `content` changes without allowing user edits.
 */
export function TiptapRenderer({ content, className }: TiptapRendererProps) {
  // Initialize TipTap editor in read-only mode
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // @ts-ignore
        link: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-600 transition-colors",
        },
      }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
  });

  // Update content reactively if it changes externally
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  //  Prevent flicker if editor not ready
  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}

