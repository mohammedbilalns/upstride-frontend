import {
	createFileRoute,
} from "@tanstack/react-router";

import { fetchChats } from "@/features/chats/services/chat.service";
import ChatListPage from "@/features/chats/pages/ChatListPage";


export const Route = createFileRoute("/(authenticated)/chats")({
	loader: async () => {
		const initialData = (await fetchChats(1, 10));
		return { initialData };
	},
	component: ChatListPage,
});


