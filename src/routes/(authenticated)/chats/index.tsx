import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

export const Route = createFileRoute("/(authenticated)/chats/")({
	component: RouteComponent,
});

function RouteComponent() {
	const isMobile = useMediaQuery("(max-width: 768px)");

	if (isMobile) {
		return null;
	}

	return (
		<div className="flex items-center justify-center h-full">
			<div className="text-center max-w-md">
				<MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
				<h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
				<p className="text-muted-foreground mb-4">
					Choose a chat from the list to start messaging or create a new
					conversation.
				</p>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Start New Chat
				</Button>
			</div>
		</div>
	);
}
