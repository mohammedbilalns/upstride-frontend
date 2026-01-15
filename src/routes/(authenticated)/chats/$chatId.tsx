import {
  createFileRoute,
} from "@tanstack/react-router";
import { fetchChat } from "@/features/chats/services/chat.service";
import NotFoundComponent from "@/components/NotFoundComponent";
import ChatPage from "@/features/chats/pages/ChatPage";

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
  component: ChatPage,
  loader: async ({ params }) => {
    const { chatId } = params;
    return await fetchChat(chatId, 1, 10)
      .then(initialData => ({ initialData }))
  },
  notFoundComponent: NotFoundComponent
});


