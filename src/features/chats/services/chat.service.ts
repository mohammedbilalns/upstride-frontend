import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { FetchChatsResponse } from "@/shared/types/chat";
import type { FetchChatResponse } from "@/shared/types/message";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function fetchChat(chatId: string, page = 1, limit = 10) {
  return apiRequest(() => api.get<FetchChatResponse>(API_ROUTES.CHATS.FETCH_CHAT(chatId), {
    params: {
      page,
      limit
    }
  }))
}


export function fetchChats(page = 1, limit = 10) {
  return apiRequest(() => api.get<FetchChatsResponse>(API_ROUTES.CHATS.FETCH, {
    params: {
      page,
      limit
    }
  }))
}