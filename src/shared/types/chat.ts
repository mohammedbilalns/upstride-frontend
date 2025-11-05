
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
