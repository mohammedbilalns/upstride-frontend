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
import { Toggle } from "../ui/toggle";

/**
 * Toolbar for TipTap editor controls.
 * Provides formatting actions like headings, lists, bold, italic, etc.
 */
export default function MenuBar({ editor }: { editor: Editor }) {
	// Used to trigger re-renders when the selection changes
	const [, forceUpdate] = useState({});

	useEffect(() => {
		// Listen for selection changes and force re-render to update active state
		const handleSelectionUpdate = () => forceUpdate({});

		editor.on("selectionUpdate", handleSelectionUpdate);

		return () => {
			editor.off("selectionUpdate", handleSelectionUpdate);
		};
	}, [editor]);

	// Toolbar options
	const options = [
		{
			id: "heading1",
			icon: <Heading1 className="size-4" />,
			onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			active: editor.isActive("heading", { level: 1 }),
		},
		{
			id: "heading2",
			icon: <Heading2 className="size-4" />,
			onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			active: editor.isActive("heading", { level: 2 }),
		},
		{
			id: "heading3",
			icon: <Heading3 className="size-4" />,
			onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			active: editor.isActive("heading", { level: 3 }),
		},
		{
			id: "bold",
			icon: <Bold className="size-4" />,
			onClick: () => editor.chain().focus().toggleBold().run(),
			active: editor.isActive("bold"),
		},
		{
			id: "italic",
			icon: <Italic className="size-4" />,
			onClick: () => editor.chain().focus().toggleItalic().run(),
			active: editor.isActive("italic"),
		},
		{
			id: "strike",
			icon: <Strikethrough className="size-4" />,
			onClick: () => editor.chain().focus().toggleStrike().run(),
			active: editor.isActive("strike"),
		},
		{
			id: "bulletList",
			icon: <List className="size-4" />,
			onClick: () => editor.chain().focus().toggleBulletList().run(),
			active: editor.isActive("bulletList"),
		},
		{
			id: "orderedList",
			icon: <ListOrdered className="size-4" />,
			onClick: () => editor.chain().focus().toggleOrderedList().run(),
			active: editor.isActive("orderedList"),
		},
		{
			id: "highlight",
			icon: <Highlighter className="size-4" />,
			onClick: () => {
				if (editor.isActive("highlight")) {
					editor.chain().focus().unsetHighlight().run();
				} else {
					editor.chain().focus().setHighlight({ color: "yellow" }).run();
				}
			},
			active: editor.isActive("highlight"),
		},
	];

	return (
		<div className="flex items-center border rounded-md p-1 mb-2 space-x-1 bg-background shadow-sm">
			{options.map((option) => (
				<Toggle
					key={option.id}
					pressed={option.active}
					onClick={option.onClick}
					size="sm"
					className="h-8 w-8 flex items-center justify-center"
				>
					{option.icon}
				</Toggle>
			))}
		</div>
	);
}

