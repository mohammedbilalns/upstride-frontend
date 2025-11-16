import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChat } from "../services/chat.service";
import type { FetchChatResponse } from "@/shared/types/message";

export const useFetchChat = (
  receiverId: string,
  initialData?: FetchChatResponse
) => {
  const limit = 10;

  return useInfiniteQuery({
    queryKey: ["chat", receiverId],
    queryFn: ({ pageParam = 1 }) => fetchChat(receiverId, pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.messages.length < limit) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [1]
    } : undefined,
    select: (data) => {
      const chatInfo = data.pages[0]?.chat;

      // Flatten all pages into a single array of messages
      const allMessages = data.pages
      .slice()
      .reverse() // oldest pages first
      .flatMap(page => page.messages || []);

      return {
        pages: data.pages,
        pageParams: data.pageParams,
        chat: chatInfo,
        messages: allMessages,
        total: data.pages[0]?.total || 0
      };
    }
  });
};
