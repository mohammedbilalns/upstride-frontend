import {
  createFileRoute,
  useLoaderData,
} from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatHeader } from "@/features/chats/components/chatHeader";
import { ChatMessage } from "@/features/chats/components/chatMessage";
import { MessageInput } from "@/features/chats/components/messageInput";
import { useChat } from "@/features/chats/hooks/useChat";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useLayoutEffect, useRef } from "react";
import { fetchChat } from "@/features/chats/services/chat.service";
import { useAuthStore } from "@/app/store/auth.store";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import NoResource from "@/components/common/NoResource";
import { useChatLayoutStore } from "@/app/store/chat-layout.store";
import NotFoundComponent from "@/components/NotFoundComponent";

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { chatId } = params;
    return await fetchChat(chatId, 1, 10)
      .then(initialData => ({ initialData }))
  },
  notFoundComponent: NotFoundComponent
});

function RouteComponent() {
  const { setShowSidebar } = useChatLayoutStore();
  const { chatId } = Route.useParams();
  const { initialData } = useLoaderData({
    from: "/(authenticated)/chats/$chatId",
  });
  const {
    chat,
    messages,
    sendMessage,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    uploadProgress,
    isUploading,
    uploadingMessages
  } = useChat(chatId, initialData)
  const isMobile = useMediaQuery("(max-width: 768px)");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const isLoadingMoreRef = useRef(false);
  const { user } = useAuthStore();

  useLayoutEffect(() => {
    if (prevScrollHeightRef.current !== null && messageContainerRef.current) {
      const newScrollHeight = messageContainerRef.current.scrollHeight;
      messageContainerRef.current.scrollTop =
        newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
      isLoadingMoreRef.current = false;
    }
    else if (messages && messages.length > 0 && !isLoadingMoreRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 100);
    }
  }, [messages]);

  const handleMenuClick = () => {
    if (setShowSidebar) {
      setShowSidebar(true);
    }
  };

  const handleLoadMore = () => {
    if (messageContainerRef.current) {
      const { scrollHeight, scrollTop } = messageContainerRef.current;
      prevScrollHeightRef.current = scrollHeight - scrollTop;
      isLoadingMoreRef.current = true;
    }
    fetchNextPage();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorState
          message={error.message || "Failed to load conversation"}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!chat && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <NoResource resource="chats" isHome={false} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background/50 relative">
      {/* Chat Header */}
      <div className="shrink-0 z-20">
        {chat ? (
          <ChatHeader chat={chat} onBack={isMobile ? handleMenuClick : () => { }} />
        ) : (
          <div className="flex items-center space-x-4 p-4 border-b h-[65px] bg-background/80 backdrop-blur-md">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={handleMenuClick}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              <div className="h-3 bg-muted rounded w-16 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 custom-scrollbar"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Pending resource="conversation" />
            </div>
          ) : (
            <>
              {messages && messages.length > 0 ? (
                <div className="py-6 space-y-6">
                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="flex justify-center py-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer h-8 text-xs font-medium bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        onClick={handleLoadMore}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2" />
                            Loading history...
                          </>
                        ) : (
                          "Load older messages"
                        )}
                      </Button>
                    </div>
                  )}

                  {messages.map((message) => {
                    const messageUploadProgress = uploadingMessages.get(message.id);
                    const isMessageUploading = messageUploadProgress !== undefined;

                    return (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message?.sender?.id === user?.id}
                        uploadProgress={messageUploadProgress || 0}
                        isUploading={isMessageUploading}
                      />
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground p-8">
                  <div className="rounded-full bg-muted/30 p-4">
                    {/* Placeholder illustration or icon */}
                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/30 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs max-w-xs">Start the conversation by sending a message below.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="absolute bottom-[calc(4rem+1px)] left-0 right-0 z-30 px-4 py-2 bg-background/95 backdrop-blur border-t">
          <div className="flex items-center space-x-3 text-xs font-medium">
            <span className="text-muted-foreground flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent mr-2" />
              Sending attachment...
            </span>
            <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-muted-foreground tabular-nums">{uploadProgress}%</span>
          </div>
        </div>
      )}

      <Separator className="opacity-50" />

      {/* Message Input */}
      <div className="shrink-0 p-4 bg-background/50 backdrop-blur-sm">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
