import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatHeader } from "./-components/chatHeader";
import { ChatMessage } from "./-components/chatMessage";
import { MessageInput } from "./-components/messageInput";
import { useChat } from "./-hooks/useChat";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { chatId } = Route.useParams();
	const navigate = useNavigate();
	const { chat, messages, sendMessage, isLoading } = useChat(chatId);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleGoBack = () => {
		navigate({ to: "/chats" });
	};

	if (!chat && !isLoading) {
		return (
			<div className="flex items-center justify-center h-full p-8 text-center">
				<div>
					<h1 className="text-2xl font-bold mb-4">Chat Not Found</h1>
					<p className="text-muted-foreground mb-6">
						The conversation you're looking for doesn't exist or has been
						removed.
					</p>
					<Button onClick={handleGoBack}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Chats
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Chat Header - Fixed height */}
			<div className="shrink-0 p-4 border-b">
				<ChatHeader chat={chat} onBack={isMobile ? handleGoBack : () => {}} />
			</div>

			{/* Chat Messages - Takes remaining space */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-muted-foreground">Loading conversation...</p>
						</div>
					</div>
				) : (
					<>
						{/* ScrollArea with explicit height */}
						<div className="flex-1 overflow-hidden">
							<ScrollArea className="h-full">
								<div className="p-4">
									<div className="space-y-4">
										{messages.map((message) => (
											<ChatMessage
												key={message.id}
												message={message}
												isOwn={message.isOwn}
											/>
										))}
										<div ref={messagesEndRef} />
									</div>
								</div>
							</ScrollArea>
						</div>

						<Separator />

						{/* Message Input - Fixed height */}
						<div className="shrink-0 p-4">
							<MessageInput onSend={sendMessage} />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
