import { Link, useParams } from "@tanstack/react-router";
import { useFetchChats } from "../hooks/useFetchChats";
import { ChatItem } from "./chatItem";
import { Button } from "@/components/ui/button";
import NoResource from "@/components/common/NoResource";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import type { Chat } from "@/shared/types/chat";

interface ChatListProps {
  //FIX: Use proper type
  chats?: Chat[];
  onItemClick?: () => void;
}

export function ChatList({ chats, onItemClick }: ChatListProps) {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useFetchChats();
  const { chatId: activeChatId } = useParams({ strict: false });

  // Use passed chats or fetch from hook
  const chatData = chats || data;

  if (isLoading) {
    return <Pending resource="conversations" />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error.message || "Failed to load conversations"} 
        onRetry={refetch} 
      />
    );
  }

  // Check if chats array exists and has items
  if (!chatData || chatData.chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <NoResource 
          resource="chats" 
          isHome={false}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto divide-y">
        {chatData.chats.map((chat:Chat) => (
          <Link
            key={chat.id}
            to="/chats/$chatId"
            params={{ chatId: chat.participant.id }}
            className="block"
            onClick={onItemClick}
          >
            <ChatItem chat={chat} isActive={chat.participant.id === activeChatId} />
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="p-4 text-center border-t shrink-0">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
