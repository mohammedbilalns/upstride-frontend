import type { ChatMessage, Participant } from "./message";

export interface Chat {
  id: string;
  userIds: string[];
  participant: Participant 
  lastMessage?: LastMessage;
  unread?: number;
  isRead?: boolean;
  updatedAt?: string;
}

export type LastMessage = Pick<ChatMessage,"content" | "type" | "createdAt" | "status"> & {
  _id: string;
  senderId: string;
}

// types from api
export interface FetchChatsResponse {
  chats: Chat[];
  total: number;
}

// TODO: check the types below

export interface ChatsQueryResult {
  pages: FetchChatsResponse[];
  pageParams: number[];
  chats: Chat[];
}

export interface ChatPage {
  messages: ChatMessage[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface TransformedChatQueryResult {
  pages: ChatPage[];
  pageParams: number[];
  chat: Chat;
  messages: ChatMessage[];
  total: number;
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
