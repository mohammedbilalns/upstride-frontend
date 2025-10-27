import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapRendererProps {
	content: string;
	className?: string;
}
export function TiptapRenderer({ content, className }: TiptapRendererProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				HTMLAttributes: {
					class: "rounded-lg max-w-full h-auto",
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-blue-500 underline hover:text-blue-600",
				},
			}),
		],
		content,
		editable: false,
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className={className}>
			<EditorContent editor={editor} />
		</div>
	);
}
