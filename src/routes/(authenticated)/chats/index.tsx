import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/(authenticated)/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-card text-center p-8">
      <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold">Select a chat</h2>
      <p className="text-muted-foreground">
        Choose a conversation from the list to start messaging.
      </p>
    </div>
  );
}
