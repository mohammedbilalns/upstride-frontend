import { useState } from "react";
import { Outlet, createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { fetchChats } from "@/features/chats/services/chat.service";
import { useChats } from "@/features/chats/hooks/useFetchChats";
import { ChatList } from "@/features/chats/components/chatList";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import { type FetchChatsResponse } from "@/shared/types/chat";


// FIX: Two network requests when opening the chats route 
export const Route = createFileRoute("/(authenticated)/chats")({
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
  component: RouteComponent
});

function RouteComponent() {
  const { initialData } = useLoaderData({ from: "/(authenticated)/chats" });
  const { chats, isLoading, error, refetch } = useChats(initialData);
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Left Sidebar - Chat List */}
          <aside className={`${
            isMobile
              ? `fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out ${
                  showSidebar ? "translate-x-0" : "-translate-x-full"
                }`
              : "w-full lg:w-1/3"
          } space-y-6 lg:sticky lg:top-6 self-start h-fit z-10`}>
            <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
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
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Connect with mentors and professionals in your network.
              </p>
            </div>
            
            <Card className="h-[calc(100vh-16rem)]">
              <CardContent className="flex flex-col h-full p-0">
                <div className="flex-1 overflow-y-auto">
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
            </Card>
          </aside>

          {/* Main Content - Chat Window */}
          <section className="w-full lg:w-2/3 min-h-[800px]">
            <div className="bg-card rounded-xl shadow-lg border border-border/50 h-[calc(100vh-10rem)]">
              <Outlet />
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
