import { useAuthStore } from "@/app/store/auth.store"; 
import { messagePayloadSchema, pendingMessageSchema } from "@/features/chats/validations/messagePayload.schema";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { Socket } from "socket.io-client";
import { queryClient } from "../router/routerConfig";
import { type ChatMessagesQueryResult } from "@/shared/types/chat";

export function registerChatEvents(socket: Socket) {
  const { user } = useAuthStore.getState(); 

  socket.on(SOCKET_EVENTS.CHAT.SEND, (data) => {
    try {
      console.log(`new Message data received from the server: ${JSON.stringify(data)}`);

      if (data.status === "pending") {

        const pending = pendingMessageSchema.parse(data);
        queryClient.setQueryData(["chat", pending.to], (oldData: ChatMessagesQueryResult | undefined) => {
          if (!oldData) return oldData;

          const newMessage = {
            id: `temp-${Date.now()}`,
            content: pending.message,
            createdAt: new Date().toISOString() as string,
            isRead: false,
            sender: {
              id: pending.from,
              name: "You",
            },
            recipient: {
              id: pending.to,
              name: "",
            },
          };

          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [...(newPages[0].messages || []), newMessage],
          };

          return { ...oldData, pages: newPages };
        });
        return;
      }

      const messageData = messagePayloadSchema.parse(data);
      const currentUserId = user?.id;

      //  If logged in user is  the sender → update ["chat", receiverId]
      // if receiver → update ["chat", senderId]
      const targetKey =
        currentUserId === messageData.senderId
          ? messageData.receiverId
          : messageData.senderId;

      queryClient.setQueryData(["chat", targetKey], (oldData: ChatMessagesQueryResult | undefined) => {
        if (!oldData) return oldData;

        const newMessage = {
          id: messageData.messageId,
          content: messageData.message,
          createdAt: messageData.timestamp,
          isRead: false,
          sender: {
            id: messageData.senderId,
            name: messageData.senderName,
          },
          recipient: {
            id: messageData.receiverId,
            name: "",
          },
        };

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          messages: [...(newPages[0].messages || []), newMessage],
        };

        return { ...oldData, pages: newPages };
      });
    } catch (err) {
      console.error("[WS] Invalid chat payload:", err);
    }
  });
}



