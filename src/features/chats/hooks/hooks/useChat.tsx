import { useFetchChat } from "./useFetchChat";
import { useMemo } from "react";

export function useChat(chatId: string, initialData?: any) {
  
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetchChat(chatId, initialData);
  
  // Extract chat info and messages from the query result
  const chatInfo = data?.chat;
  const messages = data?.messages || [];
  
  // Create a chat object that matches what ChatHeader expects
  const chat = useMemo(() => {
    if (!chatInfo?.participant) return null;
    
    return {
      id: chatInfo.id,
      name: chatInfo.participant.name,
      avatar: chatInfo.participant.profilePicture,
      // Default values for fields not in the API response
      isOnline: false, // You might want to add this to the API response
      isMentor: false, // You might want to add this to the API response
    };
  }, [chatInfo]);
  
  // Function to send a new message
  const sendMessage = async (content: string, attachments?: any[], audioBlob?: Blob) => {
    // This would call your API to send a message
    console.log("Sending message:", content, attachments, audioBlob);
    
    // After sending, you should refetch the messages
    refetch();
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
