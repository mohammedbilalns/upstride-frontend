import { useAuthStore } from "@/app/store/auth.store";
import {
  messagePayloadSchema,
  pendingMessageSchema,
  readMessagesPayloadSchema,
} from "@/features/chats/validations/messagePayload.schema";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { Socket } from "socket.io-client";
import { queryClient } from "../router/routerConfig";
import type { ChatMessagesQueryResult, ChatMessage, MessageAttachment } from "@/shared/types/message";
import type { TransformedChatQueryResult } from "@/shared/types/chat";
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
              status: "send",
              type: pending.type,
              sender: {
                id: pending.from,
                name: "You",
                profilePicture: user?.profilePicture || "",
                role: user?.role as UserRole,
                isMentor: user?.role === "mentor",
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

        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["chats"]
          })
        }, 500)
        return;
      }

      // Handle confirmed messages from the server
      const messageData = messagePayloadSchema.parse(data);

      queryClient.setQueryData(
        ["chat", messageData.senderId],
        (oldData: any) => {
          if (!oldData) return oldData;

          const chatInfo = oldData.pages?.[0]?.chat;
          const participant = chatInfo?.participant;

          const newMessage: ChatMessage = {
            id: messageData.messageId,
            chatId: messageData.chatId,
            content: messageData.message,
            createdAt: messageData.timestamp,
            status: "send",
            type: messageData.type as "TEXT" | "FILE" | "IMAGE",
            sender: {
              id: messageData.senderId,
              name: messageData.senderName,
              profilePicture: messageData.senderId === participant?.id ? participant.profilePicture : (user?.profilePicture || ""),
              role: user?.role as UserRole,
              isMentor: participant?.isMentor ?? false,
            },
            attachment: messageData.attachment as MessageAttachment,
          };

          // Check if this message already exists (optimistic update)
          const messageExists = oldData.pages[0].messages.some(
            (msg: ChatMessage) => msg.id === messageData.messageId ||
              (msg.content === messageData.message &&
                msg.sender.id === messageData.senderId &&
                Math.abs(new Date(msg.createdAt).getTime() - new Date(messageData.timestamp).getTime()) < 5000)
          );

          if (messageExists) {
            // Update existing message with confirmed data
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                messages: page.messages.map((msg: ChatMessage) =>
                  (msg.id === messageData.messageId ||
                    (msg.content === messageData.message &&
                      msg.sender.id === messageData.senderId &&
                      Math.abs(new Date(msg.createdAt).getTime() - new Date(messageData.timestamp).getTime()) < 5000))
                    ? { ...msg, id: messageData.messageId, attachment: messageData?.attachment }
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

      // Update chats list optimistically
      let chatFound = false;
      const isChatOpen = window.location.pathname.includes(messageData.senderId);

      queryClient.setQueryData(["chats"], (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          chats: page.chats.map((chat: any) => {
            if (chat.participant.id === messageData.senderId) {
              chatFound = true;
              return {
                ...chat,
                lastMessage: {
                  _id: messageData.messageId,
                  content: messageData.message || (messageData.attachment ? "Attachment" : ""),
                  type: messageData.type,
                  createdAt: messageData.timestamp,
                  status: "sent",
                  senderId: messageData.senderId
                },
                unreadCount: isChatOpen ? 0 : (chat.unreadCount || 0) + 1,
                updatedAt: new Date().toISOString()
              };
            }
            return chat;
          })
        }));

        return { ...oldData, pages: newPages };
      });

      // If chat wasn't found in current cache (e.g. new chat), invalidate to fetch it
      if (!chatFound) {
        queryClient.invalidateQueries({
          queryKey: ["chats"]
        });
      }
    } catch (err) {
      console.error("[WS] Invalid chat payload:", err);
    }
  });


  socket.on(SOCKET_EVENTS.CHAT.MARK_MESSAGE_READ, (data) => {
    try {
      console.log(`[WS] Mark as read payload:`, data);

      const { recieverId } = readMessagesPayloadSchema.parse(data);

      // receiverId is the person who sent the messages (current user)
      queryClient.setQueryData(
        ["chat", recieverId],
        (oldData: TransformedChatQueryResult | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              messages: page.messages.map(msg => ({
                ...msg,
                status: "read"
              }))
            }))
          };
        }
      );

  
    } catch (err) {
      console.error("[WS] Invalid mark as read payload:", err);
    }
  });

  socket.on(SOCKET_EVENTS.CHAT.MARK_CHAT_READ, (data) => {
    try {
      console.log(`[WS] Mark chat read payload:`, data);

      const chatId = data.recieverId;

      queryClient.setQueryData(
        ["chat", chatId],
        (oldData: TransformedChatQueryResult | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              messages: page.messages.map(msg => ({
                ...msg,
                status: "read"
              }))
            }))
          };
        }
      );
    } catch (err) {
      console.error("[WS] Invalid mark chat read payload:", err);
    }
  });
}
