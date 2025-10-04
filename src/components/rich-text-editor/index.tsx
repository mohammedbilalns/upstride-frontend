import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight"
import MenuBar from "./menuBar";

interface RichTextEditorProps {
	content: string
	onChange: (content: string) => void
}
function RichTextEditor({content, onChange}: RichTextEditorProps){
	const editor = useEditor({
		extensions: [StarterKit.configure({
			bulletList: {
				HTMLAttributes: {
					class: "list-disc ml-3"
				}
			},
			orderedList:{
				HTMLAttributes: {
					class: "list-decimal ml-3"
				}
			}
		}),Highlight.configure({
				HTMLAttributes:{
					class: "bg-yellow-200 hover:bg-yellow-300 text-black "
				}
			})],
		content,
		editorProps: {
			attributes: {
				class: "min-h-[300px] border rounded-md mx-auto  py-2 px-3"
			}
		},
		onUpdate: ({editor}) => {
			onChange(editor.getHTML())
		}
	})

	return (
	<div>
			<MenuBar editor={editor}/>	
			<EditorContent editor={editor} />
		</div>
	)
}




export default RichTextEditor
