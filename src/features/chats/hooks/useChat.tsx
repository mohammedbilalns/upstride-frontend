import { useState, useMemo, useEffect } from "react";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import { useFetchChat } from "./useFetchChat";
import { useMarkChatNotificationsAsRead } from "@/features/notifications/hooks/notifications-mutations.hooks";
import { queryClient } from "@/app/router/routerConfig";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { TransformedChatQueryResult } from "@/shared/types/chat";
import { toast } from "sonner";
import type { FetchChatResponse, MessageAttachment, SendMessagePayload } from "@/shared/types/message";
import { useAuthStore } from "@/app/store/auth.store";
import { useSocketStore } from "@/app/store/socket.store";

// File size limits in bytes
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * hook that manages chat state and message sending for a specific chat.
 * handles optimistic UI updates, and pagination.
 */
export function useChat(chatId: string, initialData?: FetchChatResponse) {
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const { handleUpload, uploadProgress, isUploading } = useUploadMedia();

  // Track which messages are currently uploading
  const [uploadingMessages, setUploadingMessages] = useState<Map<string, number>>(new Map());

  // Fetch chat data and paginated messages
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchChat(chatId, initialData);

  const chatInfo = data?.chat;
  const messages = data?.messages || [];

  // Memoize minimal chat info 
  const chat = useMemo(() => {
    if (!chatInfo?.participant) return null;
    return {
      id: chatInfo.id,
      name: chatInfo.participant.name,
      avatar: chatInfo.participant.profilePicture,
      isMentor: chatInfo.participant.isMentor ?? false,
    };
  }, [chatInfo]);

  const { mutate: markNotificationsRead } = useMarkChatNotificationsAsRead();

  // Mark messages as read when chat opens or new message arrives
  useEffect(() => {
    if (!socket || !user?.id || messages.length === 0) return;

    markNotificationsRead(chatId);

    const lastMessage = messages[messages.length - 1];

    // Only mark as read if the last message is not from the current user
    if (lastMessage && lastMessage.sender.id !== user.id && lastMessage.status !== 'read') {
      markChatRead();
    }
  }, [chatId, messages.length, socket, user?.id]);

  /**
   * Mark messages as read and update UI optimistically
   */
  const markChatRead = () => {
    if (!socket || !user?.id) return;

    // Emit mark as read event
    socket.emit(SOCKET_EVENTS.CHAT.MARK_CHAT_READ, {
      senderId: chatId
    });

    // Optimistically update the current chat messages
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



    queryClient.setQueryData(
      ["chats"],
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            chats: page.chats.map((chat: any) =>
              chat.participant.id === chatId
                ? { ...chat, unreadCount: 0 }
                : chat
            )
          }))
        };
      }
    );
  };

  /**
   * Send a message 
   * - Upload file if provided
   * - Emits a socket event to the server
   * - Optimistically updates the chat UI
   */
  const sendMessage = async (
    content: string,
    attachment?: File,
  ) => {
    if (!socket) return;

    // Trim the content to check if it's empty
    const trimmedContent = content.trim();

    // Don't send if both content and attachment are empty
    if (!trimmedContent && !attachment) {
      return;
    }

    // Validate file size if attachment exists
    if (attachment) {
      const isImage = attachment.type.startsWith("image/");
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

      if (attachment.size > maxSize) {
        const sizeMB = (attachment.size / (1024 * 1024)).toFixed(2);
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
        const fileType = isImage ? "image" : "file";

        toast.error(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} size (${sizeMB}MB) exceeds the maximum allowed size of ${maxSizeMB}MB`);
        return;
      }
    }

    // Create temporary message ID for optimistic update
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI update - add the message immediately
    queryClient.setQueryData(
      ["chat", chatId],
      (oldData: TransformedChatQueryResult | undefined) => {
        if (!oldData) return oldData;

        // Create temporary attachment for preview if file exists
        let tempAttachment: MessageAttachment | undefined;
        if (attachment) {
          tempAttachment = {
            url: URL.createObjectURL(attachment),
            fileType: attachment.type.startsWith("image/") ? "image" : "file",
            size: attachment.size,
            name: attachment.name,
          };
        }

        return {
          ...oldData,
          messages: [
            ...(oldData.messages || []),
            {
              id: tempId,
              content: trimmedContent,
              createdAt: new Date().toISOString(),
              status: "sent",
              sender: {
                id: user?.id ?? "me",
                name: user?.name ?? "You",
                avatar: user?.profilePicture ?? "",
              },
              recipient: {
                id: chatId,
                name: chat?.name || "",
                avatar: chat?.avatar || "",
              },
              type: attachment ? "FILE" : "TEXT",
              attachments: attachment ? [tempAttachment] : [],
            },
          ],
        };
      }
    );

    try {
      // Upload file if provided
      let uploadedAttachment: MessageAttachment | undefined;

      if (attachment) {
        try {
          // Mark this message as uploading
          setUploadingMessages(prev => new Map(prev).set(tempId, 0));

          // Upload the file
          const result = await handleUpload(attachment);

          // Update progress for this specific message
          setUploadingMessages(prev => {
            const newMap = new Map(prev);
            newMap.set(tempId, uploadProgress);
            return newMap;
          });

          // Convert upload result to attachment format
          uploadedAttachment = {
            url: result.secure_url,
            fileType: result.resource_type === "image" ? "image" : "file",
            size: result.bytes,
            name: result.original_filename,
          };

          // Remove from uploading set
          setUploadingMessages(prev => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          toast.error("Failed to upload file");

          // Remove from uploading set
          setUploadingMessages(prev => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });

          // Remove the optimistic message if upload fails
          queryClient.setQueryData(
            ["chat", chatId],
            (oldData: TransformedChatQueryResult | undefined) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                messages: oldData.messages.filter(msg => msg.id !== tempId),
              };
            }
          );

          return;
        }
      }

      // Construct message payload for socket emission
      // Only include message field if there's actual content
      const payload: SendMessagePayload = {
        to: chatId,
        type: uploadedAttachment ? "FILE" : "TEXT",
        media: uploadedAttachment,
      };

      // Only add message if there's content
      if (trimmedContent) {
        payload.message = trimmedContent;
      }

      // Emit message event through WebSocket
      socket.emit(SOCKET_EVENTS.CHAT.SEND, payload);

      // Update the message with the actual uploaded file
      if (uploadedAttachment) {
        queryClient.setQueryData(
          ["chat", chatId],
          (oldData: TransformedChatQueryResult | undefined) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              messages: oldData.messages.map(msg =>
                msg.id === tempId
                  ? { ...msg, attachments: [uploadedAttachment] }
                  : msg
              ),
            };
          }
        );
      }


    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

      // Remove from uploading set
      setUploadingMessages(prev => {
        const newMap = new Map(prev);
        newMap.delete(tempId);
        return newMap;
      });

      // Remove the optimistic message if sending fails
      queryClient.setQueryData(
        ["chat", chatId],
        (oldData: TransformedChatQueryResult | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            messages: oldData.messages.filter(msg => msg.id !== tempId),
          };
        }
      );
    }
  };

  return {
    chat,
    messages,
    isLoading,
    error,
    sendMessage,
    markChatRead,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    uploadProgress,
    isUploading,
    uploadingMessages,
  };
}
