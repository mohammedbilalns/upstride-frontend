import { createFileRoute, Outlet, useLoaderData } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ChatList } from "@/features/chats/hooks/components/chatList";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { fetchChats } from "@/features/chats/services/chat.service";
import { useChats } from "@/features/chats/hooks/hooks/useFetchChats";
import { type  FetchChatsResponse } from "@/shared/types/chat";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";

export const Route = createFileRoute("/(authenticated)/chats")({
  component: RouteComponent,
  loader: async () => {
    try {
      const initialData = await fetchChats(1, 10) as FetchChatsResponse;
      return { initialData };
    } catch (error) {
      throw new Error("Failed to load chats");
    }
  },
  errorComponent: ({ error }) => (
    <ErrorState 
      message={error.message || "Failed to load conversations"} 
      onRetry={() => window.location.reload()} 
    />
  ),
});

function RouteComponent() {
  const { initialData } = useLoaderData({ from: "/(authenticated)/chats" });
  const { chats, isLoading, error, refetch } = useChats(initialData);
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">
              Connect with mentors and professionals in your network.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden relative min-h-0">
        {/* Mobile Sidebar Overlay */}
        {isMobile && showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Chat List Sidebar */}
        <div
          className={`${
            isMobile
              ? `fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out ${
                  showSidebar ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-full md:w-1/3"
          } flex flex-col border rounded-lg`}
        >
          <CardHeader className="pb-3 shrink-0">
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Chat List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoading ? (
                <Pending resource="conversations" />
              ) : error ? (
                <ErrorState 
                  message={error.message || "Failed to load conversations"} 
                  onRetry={refetch} 
                />
              ) : (
                <ChatList
                  onItemClick={() => isMobile && setShowSidebar(false)}
                />
              )}
            </div>
          </CardContent>
        </div>
        <div
          className={`flex-1 min-h-0 ${isMobile ? "w-full" : ""} border rounded-lg bg-muted/20`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
