import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ArticleNotFound() {
	const navigate = useNavigate();
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<FileX className="h-16 w-16 text-muted-foreground mb-4" />
			<h1 className="text-3xl font-bold mb-2">Article Not Found</h1>
			<p className="text-muted-foreground mb-6 max-w-md">
				Sorry, the article you're looking for doesn't exist or has been removed.
			</p>
			<Button
				onClick={() => navigate({ to: "/articles" })}
			>
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back to Articles
			</Button>
		</div>
	);
}
