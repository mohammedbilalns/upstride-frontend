import { useAuthStore } from "@/app/store/auth.store";
import {
  messagePayloadSchema,
  pendingMessageSchema,
} from "@/features/chats/validations/messagePayload.schema";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { Socket } from "socket.io-client";
import { queryClient } from "../router/routerConfig";
import type { ChatMessagesQueryResult, ChatMessage, MessageAttachment } from "@/shared/types/message";
import type { UserRole } from "@/shared/types";

/**
 * Registers WebSocket listeners for chat-related events.
 * Handles pending (optimistic) messages and confirmed server messages.
 */
export function registerChatEvents(socket: Socket) {
  const { user } = useAuthStore.getState();

  socket.on(SOCKET_EVENTS.CHAT.SEND, (data) => {
    try {
      console.log(`[WS] Incoming message payload:`, data);

      // Handle pending (optimistic) messages before server acknowledgment
      if (data.status === "pending") {
        const pending = pendingMessageSchema.parse(data);
        queryClient.setQueryData(
          ["chat", pending.to],
          (oldData: ChatMessagesQueryResult | undefined) => {
            if (!oldData) return oldData;

            const newMessage: ChatMessage = {
              id: `temp-${Date.now()}`,
              chatId: pending.to,
              content: pending.message,
              createdAt: new Date().toISOString(),
              status:"send",
              type: pending.type,
              sender: {
                id: pending.from,
                name: "You",
                profilePicture: user?.profilePicture || "",
                role: user?.role as UserRole,
              },
              attachment: pending?.media as MessageAttachment,
            };

            const newPages = [...oldData.pages];
            newPages[0] = {
              ...newPages[0],
              messages: [...(newPages[0].messages || []), newMessage],
            };

            return { ...oldData, pages: newPages };
          }
        );
        return;
      }

      // Handle confirmed messages from the server
      const messageData = messagePayloadSchema.parse(data);

      queryClient.setQueryData(
        ["chat", messageData.senderId],
        (oldData: ChatMessagesQueryResult | undefined) => {
          if (!oldData) return oldData;

          const newMessage: ChatMessage = {
            id: messageData.messageId,
            chatId:messageData.chatId,
            content: messageData.message,
            createdAt:messageData.timestamp,
            status: "send",
            type: messageData.type,
            sender: {
              id: messageData.senderId,
              name: messageData.senderName,
              profilePicture: user?.profilePicture,
              role: user?.role as UserRole,
            },
            attachment: messageData.attachment as MessageAttachment,
          };

          // Check if this message already exists (optimistic update)
          const messageExists = oldData.pages[0].messages.some(
            msg => msg.id === messageData.messageId || 
              (msg.content === messageData.message && 
                msg.sender.id === messageData.senderId && 
                Math.abs(new Date(msg.createdAt).getTime() - new Date(messageData.timestamp).getTime()) < 5000)
          );

          if (messageExists) {
            // Update existing message with confirmed data
            return {
              ...oldData,
              pages: oldData.pages.map(page => ({
                ...page,
                messages: page.messages.map(msg => 
                  (msg.id === messageData.messageId || 
                    (msg.content === messageData.message && 
                      msg.sender.id === messageData.senderId && 
                      Math.abs(new Date(msg.createdAt).getTime() - new Date(messageData.timestamp).getTime()) < 5000))
                    ? { ...msg, id: messageData.messageId, attachment: messageData?.attachment}
                    : msg
                )
              }))
            };
          } else {
            const newPages = [...oldData.pages];
            newPages[0] = {
              ...newPages[0],
              messages: [...(newPages[0].messages || []), newMessage],
            };

            return { ...oldData, pages: newPages };
          }
        }
      );
    } catch (err) {
      console.error("[WS] Invalid chat payload:", err);
    }
  });
}
