import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChats } from "../services/chat.service";
import type { FetchChatsResponse, ChatsQueryResult } from "@/shared/types/chat";

export const useFetchChats = (initialData?: FetchChatsResponse) => {
  const limit = 10;
  return useInfiniteQuery<FetchChatsResponse, Error, ChatsQueryResult>({
    queryKey: ["chats"],
    queryFn: ({ pageParam = 1 }) => fetchChats(pageParam as number, limit),
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.chats.length < limit) return undefined;
      return (lastPageParam as number) + 1;
    },
    initialPageParam: 1,
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [1]
    } : undefined,
    select: (data) => {
      const allChats = data.pages.flatMap(page => page.chats);
      
      return {
        pages: data.pages,
        pageParams: data.pageParams as number[],
        chats: allChats
      };
    }
  });
};
