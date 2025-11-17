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

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { chatId } = params;
    return await fetchChat(chatId, 1, 10)
      .then(initialData => ({ initialData }))
      .catch(() => {
        throw new Error("Failed to load chat");
      });
  }
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
    <div className="flex flex-col h-full bg-card">
      {/* Chat Header */}
      <div className="shrink-0">
        {chat ? (
          <ChatHeader
            chat={chat}
            onBack={isMobile ? handleMenuClick : () => {}}
          />
        ) : (
            <div className="flex items-center space-x-3 p-4 border-b">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={handleMenuClick}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {isLoading ? (
            <Pending resource="conversation" />
          ) : (
              <>
                {messages && messages.length > 0 ? (
                  <div className="space-y-4 p-4">
                    {/* Load More Button */}
                    {hasNextPage && (
                      <div className="flex justify-center py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={handleLoadMore}
                          disabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                              Loading...
                            </>
                          ) : (
                              "View more messages"
                            )}
                        </Button>
                      </div>
                    )}

                    {messages.map(message => {
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
                    <div className="flex items-center justify-center h-full">
                      <NoResource resource="messages" isHome={false} />
                    </div>
                  )}
              </>
            )}
        </div>
      </div>

      <Separator />

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="px-4 py-2 bg-muted">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="shrink-0 p-4">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
