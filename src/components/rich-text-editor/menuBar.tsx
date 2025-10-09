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
import { Toggle } from "../ui";
import { useEffect, useState } from "react";

function MenuBar({ editor }: { editor?: Editor }) {
	if (!editor) return null;
    const [, forceUpdate] = useState({});
    
    useEffect(() => {
        const handleSelectionUpdate = () => {
            forceUpdate({});
        };
        
        editor.on('selectionUpdate', handleSelectionUpdate);
        
        return () => {
            editor.off('selectionUpdate', handleSelectionUpdate);
        };
    }, [editor]);

	const options = [
		{
			icon: <Heading1 className="size-4" />,
			onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			pressed: editor.isActive("heading", { level: 1 }),
		},
		{
			icon: <Heading2 className="size-4" />,
			onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			pressed: editor.isActive("heading", { level: 2 }),
		},
		{
			icon: <Heading3 className="size-4" />,
			onclick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			pressed: editor.isActive("heading", { level: 3 }),
		},
		{
			icon: <Bold className="size-4" />,
			onclick: () => editor.chain().focus().toggleBold().run(),
			pressed: editor.isActive("bold"),
		},
		{
			icon: <Italic className="size-4" />,
			onclick: () => editor.chain().focus().toggleItalic().run(),
			pressed: editor.isActive("italic"),
		},
		{
			icon: <Strikethrough className="size-4" />,
			onclick: () => editor.chain().focus().toggleStrike().run(),
			pressed: editor.isActive("strike"),
		},
		{
			icon: <List className="size-4" />,
			onclick: () => editor.chain().focus().toggleBulletList().run(),
			pressed: editor.isActive("bulletList"),
		},
		{
			icon: <ListOrdered className="size-4" />,
			onclick: () => editor.chain().focus().toggleOrderedList().run(),
			pressed: editor.isActive("orderedList"),
		},
		{
			icon: <Highlighter className="size-4" />,
			onclick: () =>
				editor.chain().focus().toggleHighlight({ color: "yellow" }).run(),
			pressed: editor.isActive("highlight"),
		},
	];

	return (
		<div className="flex items-center border rounded-md p-1 mb-1 space-x-2 z-50 bg-background">
			{options.map((option, index) => (
				<Toggle
					key={index}
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
