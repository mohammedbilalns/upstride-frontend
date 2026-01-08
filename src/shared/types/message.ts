import type { ChatPage } from "./chat";
import type { User } from "./user";

export interface MessageAttachment {
  url: string;
  size: number;
  fileType: string;
  name: string;
}
export type Participant = Pick<User, "id" | "name" | "profilePicture" | "role"> & { isMentor: boolean; mentorId?: string };

export interface ChatMessage {
  id: string;
  chatId: string;
  content?: string;
  type: "TEXT" | "FILE" | "IMAGE";
  status: "send" | "read" | "sent";
  createdAt: string;
  sender: Participant;
  attachment?: MessageAttachment;
}

export interface FetchChatResponse {
  chat: {
    id: string;
    participant: Participant
  },
  messages: ChatMessage[];
  total: number;
}

export interface SendMessagePayload {
  to: string;
  message?: string;
  type: "FILE" | "TEXT" | "IMAGE";
  media?: MessageAttachment;
  tempId?: string;
}

export interface ChatMessagesQueryResult {
  pages: ChatPage[];
  pageParams: number[];
  messages: ChatMessage[];
  total: number;
}
