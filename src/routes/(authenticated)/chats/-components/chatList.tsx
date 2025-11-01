import { Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { useChats } from "../-hooks/useChat";
import { ChatItem } from "./chatItem";

interface ChatListProps {
	onItemClick?: () => void;
}

export function ChatList({ onItemClick }: ChatListProps) {
	const { chats } = useChats();

	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-8 text-center">
				<MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
				<p className="text-muted-foreground mb-4">
					Start a conversation with a mentor or someone from your network.
				</p>
			</div>
		);
	}

	return (
		<div className="divide-y">
			{chats.map((chat) => (
				<Link
					key={chat.id}
					to="/chats/$chatId"
					params={{ chatId: chat.id }}
					className="block hover:bg-muted/50 transition-colors"
					onClick={onItemClick}
				>
					<ChatItem chat={chat} />
				</Link>
			))}
		</div>
	);
}
