import { createFileRoute, useNavigate, useLoaderData } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatHeader } from "@/features/chats/hooks/components/chatHeader";
import { ChatMessage } from "@/features/chats/hooks/components/chatMessage";
import { MessageInput } from "@/features/chats/hooks/components/messageInput";
import { useChat } from "@/features/chats/hooks/hooks/useChat";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { useEffect, useRef } from "react";
import { fetchChat } from "@/features/chats/services/chat.service";
import { useAuthStore } from "@/app/store/auth.store";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import NoResource from "@/components/common/NoResource";

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      const { chatId } = params;
      const initialData = await fetchChat(chatId, 1, 10);
      
      return { initialData };
    } catch (error) {
      throw new Error("Failed to load chat");
    }
  },
  errorComponent: ({ error }) => (
    <ErrorState 
      message={error.message || "Failed to load conversation"} 
      onRetry={() => window.location.reload()} 
    />
  ),
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { initialData } = useLoaderData({ from: "/(authenticated)/chats/$chatId" });
  const navigate = useNavigate();
  const { chat, messages, sendMessage, isLoading, error, refetch } = useChat(chatId, initialData);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGoBack = () => {
    navigate({ to: "/chats" });
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
        <NoResource 
          resource="chats" 
          isHome={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header - Fixed height */}
      <div className="shrink-0 p-4 border-b">
        {chat ? (
          <ChatHeader chat={chat} onBack={isMobile ? handleGoBack : () => {}} />
        ) : (
          <div className="flex items-center space-x-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
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

      {/* Chat Messages - Takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoading ? (
          <Pending resource="conversation" />
        ) : (
          <>
            {/* ScrollArea with explicit height */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          isOwn={message.sender.id === user?.id}
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <NoResource 
                        resource="messages" 
                        isHome={false}
                      />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Message Input - Fixed height */}
            <div className="shrink-0 p-4">
              <MessageInput onSend={sendMessage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
