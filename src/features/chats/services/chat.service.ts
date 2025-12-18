import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { FetchChatsResponse } from "@/shared/types/chat";
import type { FetchChatResponse } from "@/shared/types/message";
import { apiRequest } from "@/shared/utils/apiWrapper";

/**
 * Fetches messages for a specific chat with pagination support.
 *
 * @param chatId - Unique identifier of the chat.
 * @param page - Page number for paginated messages (default: 1).
 * @param limit - Number of messages per page (default: 10).
 * @returns Paginated list of messages for the given chat.
 */
export function fetchChat(chatId: string, page = 1, limit = 10) {
  return apiRequest(() => api.get<FetchChatResponse>(API_ROUTES.CHATS.FETCH_CHAT(chatId), {
    params: {
      page,
      limit
    }
  }))
}


/**
 * Fetches all chats associated with the authenticated user.
 * Supports pagination for large chat lists.
 *
 * @param page - Page number for paginated chats (default: 1).
 * @param limit - Number of chats per page (default: 10).
 * @returns Paginated list of chats.
 */
export function fetchChats(page = 1, limit = 10) {
  return apiRequest(() => api.get<FetchChatsResponse>(API_ROUTES.CHATS.FETCH, {
    params: {
      page,
      limit
    }
  }))
}
