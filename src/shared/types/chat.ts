export interface Participant {
  id: string;
  name: string;
  profilePicture?: string;
  interestedExpertises?: string[];
  interestedSkills?: string[];
  isOnline?: boolean;
  isMentor?: boolean;
}

export interface LastMessage {
  _id: string;
  content: string;
  type: "TEXT" | "FILE" | "AUDIO" | "IMAGE";
  createdAt: string;
  senderId?: string;
  isRead?: boolean;
}

export interface Chat {
  id: string;
  userIds: string[];
  participant: Participant;
  lastMessage?: LastMessage;
  unread?: number;
  isRead?: boolean;
  updatedAt?: string;
}

export interface FetchChatsResponse {
  chats: Chat[];
  total: number;
  page?: number;
  limit?: number;
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
  type: "TEXT" | "FILE" | "AUDIO" | "IMAGE";
  timestamp: string;
  isRead?: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  type: "image" | "file" | "audio";
  name?: string;
  url?: string;
  size?: number;
  fileType?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string | Date;
  isRead: boolean;
  type: "TEXT" | "FILE" | "AUDIO" | "IMAGE";
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments?: MessageAttachment[];
}

export interface ChatPage {
  messages: ChatMessage[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ChatMessagesQueryResult {
  pages: ChatPage[];
  pageParams: number[];
  messages: ChatMessage[];
  total: number;
}

export interface SendMessagePayload {
  to: string;
  message: string;
  type: "FILE" | "TEXT" | "AUDIO" | "IMAGE";
  media?: MessageAttachment;
  audio?: MessageAttachment;
}

export interface FetchChatResponse {
  chat: Chat;
  messages: ChatMessage[];
  total: number;
}

export interface TransformedChatQueryResult {
  pages: ChatPage[];
  pageParams: number[];
  chat: Chat;
  messages: ChatMessage[];
  total: number;
}

// Additional utility types
export interface ChatListItem extends Chat {
  isActive?: boolean;
}

export interface MessageInputState {
  message: string;
  files: File[];
  audioBlob?: Blob;
  isRecording: boolean;
}

export interface ChatLayoutState {
  showSidebar: boolean;
  activeChatId?: string;
}
