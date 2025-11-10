import { useSocketStore } from "@/app/store/socket.store";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import { useFetchChat } from "./useFetchChat";
import { queryClient } from "@/app/router/routerConfig";
import { useAuthStore } from "@/app/store/auth.store";
import { useMemo } from "react";
import {
  type FetchChatResponse,
  type SendMessagePayload,
  type TransformedChatQueryResult,
  type MessageAttachment,
} from "@/shared/types/chat";

/**
 * hook that manages chat state and message sending for a specific chat.
 * handles optimistic UI updates, and pagination.
 */

export function useChat(chatId: string, initialData?: FetchChatResponse) {
  const { socket } = useSocketStore();
  const { user } = useAuthStore();

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
      isOnline: chatInfo.participant.isOnline ?? false,
      isMentor: chatInfo.participant.isMentor ?? false,
    };
  }, [chatInfo]);

  /**
   * Send a message 
   * - Emits a socket event to the server
   * - Optimistically updates the chat UI
   */
  const sendMessage = async (
    content: string,
    attachments?: File[],
    audioBlob?: Blob
  ) => {
    if (!socket || !content.trim()) return;
    // TODO: Implement client-side message validation before sending

    // Build a media attachment if a file exists
    let media: MessageAttachment | undefined;
    if (attachments && attachments.length > 0) {
      const file = attachments[0];
      const tempUrl = URL.createObjectURL(file);

      media = {
        type: file.type.startsWith("image/") ? "image" : "file",
        url: tempUrl,
        fileType: file.type,
        size: file.size,
        name: file.name,
      };
    }

    // Build an audio attachment if a recording exists
    let audio: MessageAttachment | undefined;
    if (audioBlob) {
      const tempUrl = URL.createObjectURL(audioBlob);

      audio = {
        type: "audio",
        url: tempUrl,
        fileType: audioBlob.type,
        size: audioBlob.size,
      };
    }

    // Construct message payload for socket emission
    const payload: SendMessagePayload = {
      to: chatId,
      message: content,
      type: media ? "FILE" : audio ? "AUDIO" : "TEXT",
      media,
      audio,
    };

    // Emit message event through WebSocket
    socket.emit(SOCKET_EVENTS.CHAT.SEND, payload);

    //  Optimistic UI update — append the new message 
    queryClient.setQueryData(
      ["chat", chatId],
      (oldData: TransformedChatQueryResult | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          messages: [
            ...(oldData.messages || []),
            {
              id: `temp-${Date.now()}`,
              content,
              timestamp: new Date().toISOString(),
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
              type: payload.type,
              attachments: media ? [media] : audio ? [audio] : [],
            },
          ],
        };
      }
    );
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
  };
}

