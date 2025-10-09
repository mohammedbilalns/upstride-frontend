import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menuBar";
import { useState } from "react";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
}

function RichTextEditor({ content, onChange }: RichTextEditorProps) {

	const [selectionKey, setSelectionKey] = useState(0)
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "list-disc ml-3",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal ml-3",
					},
				},
			}),
			Highlight.configure({
				HTMLAttributes: {
					class: "bg-yellow-200 hover:bg-yellow-300 text-black ",
				},
			}),
		],
		content,
		editorProps: {
			attributes: {
				class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none h-full overflow-y-auto py-2 px-3",

			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		onSelectionUpdate: () =>{
			setSelectionKey(prev => prev + 1)
		}
	});

	return (
		<div>
			<MenuBar key={selectionKey} editor={editor} />
			<div className="flex-1 overflow-hidden" >

			<EditorContent editor={editor} className="h-full" />
			</div>
		</div>
	);
}

export default RichTextEditor;
