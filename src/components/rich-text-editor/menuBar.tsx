import type { Editor } from "@tiptap/react";
import {
	Bold,
	Heading1,
	Heading2,
	Heading3,
	Highlighter,
	Italic,
	List,
	ListOrdered,
	Strikethrough,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toggle } from "../ui";

function MenuBar({ editor }: { editor: Editor }) {
	const [, forceUpdate] = useState({});

	useEffect(() => {
		const handleSelectionUpdate = () => {
			forceUpdate({});
		};

		editor.on("selectionUpdate", handleSelectionUpdate);

		return () => {
			editor.off("selectionUpdate", handleSelectionUpdate);
		};
	}, [editor]);

	const options = [
		{
			id: "heading",
			icon: <Heading1 className="size-4" />,
			onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			pressed: editor.isActive("heading", { level: 1 }),
		},
		{
			id: "heading2",
			icon: <Heading2 className="size-4" />,
			onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			pressed: editor.isActive("heading", { level: 2 }),
		},
		{
			id: "heading3",
			icon: <Heading3 className="size-4" />,
			onclick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			pressed: editor.isActive("heading", { level: 3 }),
		},
		{
			id: "bold",
			icon: <Bold className="size-4" />,
			onclick: () => editor.chain().focus().toggleBold().run(),
			pressed: editor.isActive("bold"),
		},
		{
			id: "italic",
			icon: <Italic className="size-4" />,
			onclick: () => editor.chain().focus().toggleItalic().run(),
			pressed: editor.isActive("italic"),
		},
		{
			id: "strike",
			icon: <Strikethrough className="size-4" />,
			onclick: () => editor.chain().focus().toggleStrike().run(),
			pressed: editor.isActive("strike"),
		},
		{
			id: "bulletList",
			icon: <List className="size-4" />,
			onclick: () => editor.chain().focus().toggleBulletList().run(),
			pressed: editor.isActive("bulletList"),
		},
		{
			id: "orderedList",
			icon: <ListOrdered className="size-4" />,
			onclick: () => editor.chain().focus().toggleOrderedList().run(),
			pressed: editor.isActive("orderedList"),
		},
		{
			id: "highlight",
			icon: <Highlighter className="size-4" />,
			onclick: () => {
				if (editor.isActive("highlight")) {
					editor.chain().focus().unsetHighlight().run();
				} else {
					editor.chain().focus().setHighlight({ color: "yellow" }).run();
				}
			},
			pressed: editor.isActive("highlight"),
		},
	];

	return (
		<div className="flex items-center border rounded-md p-1 mb-1 space-x-2 z-50 bg-background">
			{options.map((option) => (
				<Toggle
					key={option.id}
					pressed={option.pressed}
					onClick={option.onclick}
					size="sm"
					className="h-8 w-8"
				>
					{option.icon}
				</Toggle>
			))}
		</div>
	);
}

export default MenuBar;
