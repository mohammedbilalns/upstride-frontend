import { useSocketStore } from "@/app/store/socket.store";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import { useFetchChat } from "./useFetchChat";
import { queryClient } from "@/app/router/routerConfig";
import { useAuthStore } from "@/app/store/auth.store";
import { useMemo } from "react";
import { type FetchChatResponse, type SendMessagePayload, type ChatMessagesQueryResult } from "@/shared/types/chat";

export function useChat(chatId: string, initialData?: FetchChatResponse) {
  const { socket } = useSocketStore();
  const { user } = useAuthStore(); 
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetchChat(chatId, initialData);

  const chatInfo = data?.chat;
  const messages = data?.messages || [];

  const chat = useMemo(() => {
    if (!chatInfo?.participant) return null;
    return {
      id: chatInfo.id,
      name: chatInfo.participant.name,
      avatar: chatInfo.participant.profilePicture,
      isOnline: false,
      isMentor: false,
    };
  }, [chatInfo]);


const sendMessage = async (content: string, attachments?: File[], audioBlob?: Blob) => {
  if (!socket || !content.trim()) return;

  // ✅ Construct media if file exists
  let media: { url: string; fileType?: string; size?: number } | undefined;
  if (attachments && attachments.length > 0) {
    const file = attachments[0];
    const tempUrl = URL.createObjectURL(file);
    media = {
      url: tempUrl,
      fileType: file.type,
      size: file.size,
    };
  }

  let audio: { url: string; fileType?: string; size?: number } | undefined;
  if (audioBlob) {
    const tempUrl = URL.createObjectURL(audioBlob);
    audio = {
      url: tempUrl,
      fileType: audioBlob.type,
      size: audioBlob.size,
    };
  }

  // ✅ Build payload dynamically
  const payload: SendMessagePayload = {
    to: chatId,
    message: content,
    type: media ? "FILE" : (audio ? "AUDIO" : "TEXT"),
  };

  if (media) payload.media = media;
  if (audio) payload.audio = audio;
  // ✅ Only add replyTo if there is one
  // Example: if replying to a message, pass its ID
  // if (replyMessageId) payload.replyTo = replyMessageId;

  // ✅ Emit message
  socket.emit(SOCKET_EVENTS.CHAT.SEND, payload);

  // ✅ Optimistic UI update
  queryClient.setQueryData(["chat", chatId], (oldData: ChatMessagesQueryResult | undefined) => {
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
          },
          recipient: {
            id: chatId,
            name: chat?.name || "",
          },
          attachments: media
            ? [
                {
                  type: media.fileType?.startsWith("image/") ? "image" : "file",
                  url: media.url,
                  name: media.fileType,
                },
              ]
            : [],
        },
      ],
    };
  });
};
  return {
    chat,
    messages,
    isLoading,
    error,
    sendMessage,
    refetch,
  };
}

