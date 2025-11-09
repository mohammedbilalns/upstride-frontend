import {
	createFileRoute,
	useLoaderData,
} from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatHeader } from "@/features/chats/components/chatHeader";
import { ChatMessage } from "@/features/chats/components/chatMessage";
import { MessageInput } from "@/features/chats/components/messageInput";
import { useChat } from "@/features/chats/hooks/useChat";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useEffect, useRef } from "react";
import { fetchChat } from "@/features/chats/services/chat.service";
import { useAuthStore } from "@/app/store/auth.store";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import NoResource from "@/components/common/NoResource";
import { useChatLayoutStore } from "@/app/store/chat-layout.store";

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { chatId } = params;
		return await fetchChat(chatId, 1, 10)
			.then(initialData => ({ initialData }))
			.catch(() => {
				throw new Error("Failed to load chat");
			});
	},
	errorComponent: ({ error }) => (
		<ErrorState
			message={error.message || "Failed to load conversation"}
			onRetry={() => window.location.reload()}
		/>
	),
});

function RouteComponent() {
	const { setShowSidebar } = useChatLayoutStore();
	const { chatId } = Route.useParams();
	const { initialData } = useLoaderData({
		from: "/(authenticated)/chats/$chatId",
	});
	const { chat, messages, sendMessage, isLoading, error, refetch } = useChat(
		chatId,
		initialData,
	);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { user } = useAuthStore();

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleMenuClick = () => {
		if (setShowSidebar) {
			setShowSidebar(true);
		}
	};

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<ErrorState
					message={error.message || "Failed to load conversation"}
					onRetry={refetch}
				/>
			</div>
		);
	}

	if (!chat && !isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<NoResource resource="chats" isHome={false} />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-card">
			{/* Chat Header */}
			<div className="shrink-0">
				{chat ? (
					<ChatHeader
						chat={chat}
						onBack={isMobile ? handleMenuClick : () => {}}
					/>
				) : (
					<div className="flex items-center space-x-3 p-4 border-b">
						{isMobile && (
							<Button variant="ghost" size="icon" onClick={handleMenuClick}>
								<Menu className="h-5 w-5" />
							</Button>
						)}
						<div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
						<div className="flex-1">
							<div className="h-4 bg-muted rounded w-1/3 mb-2 animate-pulse"></div>
							<div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
						</div>
					</div>
				)}
			</div>

			{/* Chat Messages */}
			<div className="flex-1 flex flex-col overflow-y-auto p-4">
				{isLoading ? (
					<Pending resource="conversation" />
				) : (
					<>
						{messages && messages.length > 0 ? (
							<div className="space-y-4">
								{messages.map(message => (
									<ChatMessage
										key={message.id}
										message={message}
										isOwn={message?.sender?.id === user?.id}
									/>
								))}
								<div ref={messagesEndRef} />
							</div>
						) : (
							<div className="flex items-center justify-center h-full">
								<NoResource resource="messages" isHome={false} />
							</div>
						)}
					</>
				)}
			</div>

			<Separator />

			{/* Message Input */}
			<div className="shrink-0 p-4">
				<MessageInput onSend={sendMessage} />
			</div>
		</div>
	);
}
