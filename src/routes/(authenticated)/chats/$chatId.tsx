import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./-components/chatHeader";
import { ChatMessage } from "./-components/chatMessage";
import { MessageInput } from "./-components/messageInput";
import { ArrowLeft } from "lucide-react";
import { useChat } from "./-hooks/useChat";

export const Route = createFileRoute("/(authenticated)/chats/$chatId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { chatId } = Route.useParams();
  const navigate = useNavigate();
  const { chat, messages, sendMessage, isLoading } = useChat(chatId);

  const handleGoBack = () => {
    navigate({ to: "/chats" });
  };

  if (!chat && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Chat Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The conversation you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chats
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Header */}
      <ChatHeader chat={chat} onBack={handleGoBack} />

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col mt-4">
        <CardContent className="flex-1 flex flex-col p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isOwn={message.isOwn}
                    />
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <MessageInput onSend={sendMessage} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
