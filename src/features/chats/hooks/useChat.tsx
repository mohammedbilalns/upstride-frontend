import { useSocketStore } from "@/app/store/socket.store";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import { useFetchChat } from "./useFetchChat";
import { queryClient } from "@/app/router/routerConfig";
import { useAuthStore } from "@/app/store/auth.store";
import { useUploadMedia } from "@/shared/hooks/useUploadMedia";
import { useMemo } from "react";
import {
  type TransformedChatQueryResult,
} from "@/shared/types/chat";
import type { FetchChatResponse, MessageAttachment, SendMessagePayload } from "@/shared/types/message";
import { toast } from "sonner";

/**
 * hook that manages chat state and message sending for a specific chat.
 * handles optimistic UI updates, and pagination.
 */
export function useChat(chatId: string, initialData?: FetchChatResponse) {
  const { socket } = useSocketStore();
  const { user } = useAuthStore();
  const { handleUpload, uploadProgress, isUploading } = useUploadMedia();

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

  /**
   * Send a message 
   * - Upload files if any
   * - Emits a socket event to the server
   * - Optimistically updates the chat UI
   */
  const sendMessage = async (
    content: string,
    attachments?: File[],
  ) => {
    if (!socket) return;

    // Create temporary message ID for optimistic update
    const tempId = `temp-${Date.now()}`;
    
    // Optimistic UI update - add the message immediately
    queryClient.setQueryData(
      ["chat", chatId],
      (oldData: TransformedChatQueryResult | undefined) => {
        if (!oldData) return oldData;

        // Create temporary attachments for preview
        let tempAttachments: MessageAttachment[] = [];
        if (attachments && attachments.length > 0) {
          tempAttachments = attachments.map(file => ({
            url: URL.createObjectURL(file),
            fileType: file.type.startsWith("image/") ? "image" : "file",
            size: file.size,
            name: file.name,
          }));
        }

        return {
          ...oldData,
          messages: [
            ...(oldData.messages || []),
            {
              id: tempId,
              content,
              createdAt: new Date().toISOString(),
              isRead: false,
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
              type: attachments && attachments.length > 0 ? "FILE" : "TEXT",
              attachments: tempAttachments,
            },
          ],
        };
      }
    );

    try {
      // Upload files if any
      let uploadedAttachments: MessageAttachment[] = [];
      
      if (attachments && attachments.length > 0) {
        try {
          // Upload each file and get the response
          const uploadPromises = attachments.map(file => handleUpload(file));
          const uploadResults = await Promise.all(uploadPromises);
          
          // Convert upload results to attachment format
          uploadedAttachments = uploadResults.map(result => ({
            url: result.secure_url,
            fileType: result.resource_type === "image" ? "image" : "file",
            size: result.bytes,
            name: result.original_filename,
          }));
        } catch (uploadError) {
          console.error("File upload failed:", uploadError);
          toast.error("Failed to upload files");
          
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
      const payload: SendMessagePayload = {
        to: chatId,
        message: content,
        type: uploadedAttachments.length > 0 ? "FILE" : "TEXT",
        media: uploadedAttachments.length > 0 ? uploadedAttachments[0] : undefined,
      };

      // Emit message event through WebSocket
      socket.emit(SOCKET_EVENTS.CHAT.SEND, payload);

      // Update the message with the actual uploaded files
      if (uploadedAttachments.length > 0) {
        queryClient.setQueryData(
          ["chat", chatId],
          (oldData: TransformedChatQueryResult | undefined) => {
            if (!oldData) return oldData;
            
            return {
              ...oldData,
              messages: oldData.messages.map(msg => 
                msg.id === tempId 
                  ? { ...msg, attachments: uploadedAttachments }
                  : msg
              ),
            };
          }
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      
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
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    uploadProgress,
    isUploading,
  };
}
