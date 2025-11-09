
export interface Participant {
  id: string;
  name: string;
  profilePicture?: string;
  interestedExpertises: string[];
  interestedSkills: string[];
}

export interface Chat {
  id: string;
  userIds: string[];
  participant: Participant;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  isRead?: boolean;
}

export interface FetchChatsResponse {
  chats: Chat[];
  total: number;
}

export interface ChatsQueryResult {
  pages: FetchChatsResponse[];
  pageParams: number[];
  chats: Chat[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
  };
  recipient: {
    id: string;
    name: string;
  };
}

export interface ChatPage {
  messages: ChatMessage[];
}

export interface ChatMessagesQueryResult {
  pages: ChatPage[];
  pageParams: unknown[];
}

export interface SendMessagePayload {
  to: string;
  message: string;
  type: "FILE" | "TEXT" | "AUDIO";
  media?: {
    url: string;
    fileType?: string;
    size?: number;
  };
  audio?: {
    url: string;
    fileType?: string;
    size?: number;
  };
}

export interface FetchChatResponse {
  chat: Chat;
  messages: ChatMessage[];
  total: number;
}
