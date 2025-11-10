import { useAuthStore } from "@/app/store/auth.store";
import {
  messagePayloadSchema,
  pendingMessageSchema,
} from "@/features/chats/validations/messagePayload.schema";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { Socket } from "socket.io-client";
import { queryClient } from "../router/routerConfig";
import { type ChatMessagesQueryResult, type ChatMessage } from "@/shared/types/chat";

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
              content: pending.message,
              createdAt: new Date().toISOString(),
              isRead: false,
              type: "TEXT", 
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
          }
        );
        return;
      }

      // Handle confirmed messages from the server
      const messageData = messagePayloadSchema.parse(data);
      const currentUserId = user?.id;

      // Determine which chat key to update (sender or receiver)
      const targetKey =
        currentUserId === messageData.senderId
          ? messageData.receiverId
          : messageData.senderId;

      // Narrow down and sanitize the message type
      const allowedTypes = ["TEXT", "FILE", "AUDIO", "IMAGE"] as const;
      const safeType = allowedTypes.includes(
        messageData.type as any
      )
        ? (messageData.type as ChatMessage["type"])
        : "TEXT";

      queryClient.setQueryData(
        ["chat", targetKey],
        (oldData: ChatMessagesQueryResult | undefined) => {
          if (!oldData) return oldData;

          //  construct a ChatMessage from the parsed data
          const newMessage: ChatMessage = {
            id: messageData.messageId,
            content: messageData.message,
            createdAt: messageData.timestamp,
            isRead: false,
            type: safeType,
            sender: {
              id: messageData.senderId,
              name: messageData.senderName,
            },
            recipient: {
              id: messageData.receiverId,
              name: "",
            },
            // attachments: "attachments" in messageData
            //   ? (messageData.attachments ?? [])
            //   : [],
          };

          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            messages: [...(newPages[0].messages || []), newMessage],
          };

          return { ...oldData, pages: newPages };
        }
      );
    } catch (err) {
      console.error("[WS] Invalid chat payload:", err);
    }
  });
}

