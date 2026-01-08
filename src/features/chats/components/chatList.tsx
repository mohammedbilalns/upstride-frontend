import { Link, useParams } from "@tanstack/react-router";
import { useFetchChats } from "../hooks/useFetchChats";
import { ChatItem } from "./chatItem";
import { Button } from "@/components/ui/button";
import NoResource from "@/components/common/NoResource";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import type { Chat } from "@/shared/types/chat";

interface ChatListProps {
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

  const chatData = chats || data?.chats || [];

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
  if (!chatData || chatData.length === 0) {
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
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {chatData.map((chat: Chat) => (
          <Link
            key={chat.id}
            to="/chats/$chatId"
            params={{ chatId: chat.participant.id }}
            className="block transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:z-10"
            onClick={onItemClick}
          >
            <ChatItem chat={chat} isActive={chat.participant.id === activeChatId} />
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="p-3 text-center border-t bg-muted/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </span>
            ) : (
              "Load older chats"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
