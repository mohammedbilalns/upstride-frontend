import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import RichTextEditor from "@/components/rich-text-editor";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

const a = 10;
const b = 32;
const c = 322;

function RouteComponent() {
	const [content, setContent] = useState("");

	function handleChange(content: string) {
		console.log(content);
		setContent(content);
	}
	return (
		<div>
			<Navbar />
			<div className="max-w-3xl mx-auto mt-19">
				<RichTextEditor></RichTextEditor>
			</div>
		</div>
	);
}
