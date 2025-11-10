import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import MenuBar from "./menuBar";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}
// FIX : content causes the main page to overflow the viewport 
export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [selectionKey, setSelectionKey] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 hover:bg-yellow-300 text-black",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-3 max-h-[500px] overflow-y-auto rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: () => {
      setSelectionKey((prev) => prev + 1);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col h-full">
      <MenuBar key={selectionKey} editor={editor!} />
      {/* This wrapper defines a scrollable region for editor content */}
      <div className="flex-1 overflow-hidden">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}

