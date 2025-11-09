import { Link } from "@tanstack/react-router";
import { useFetchChats } from "../hooks/useFetchChats";
import { ChatItem } from "./chatItem";
import { Button } from "@/components/ui/button";
import NoResource from "@/components/common/NoResource";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";

interface ChatListProps {
  onItemClick?: () => void;
}

export function ChatList({ onItemClick }: ChatListProps) {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useFetchChats();

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
  if (!data || data.chats.length === 0) {
    return (
      <NoResource 
        resource="chats" 
        isHome={false}
      />
    );
  }

  return (
    <div className="divide-y">
      {data.chats.map((chat) => (
        <Link
          key={chat.id}
          to="/chats/$chatId"
          params={{ chatId: chat.participant.id }}
          className="block hover:bg-muted/50 transition-colors"
          onClick={onItemClick}
        >
          <ChatItem chat={chat} />
        </Link>
      ))}
      
      {hasNextPage && (
        <div className="p-4 text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
