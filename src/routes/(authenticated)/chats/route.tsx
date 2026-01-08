import { useEffect } from "react";
import {
	Outlet,
	createFileRoute,
	useLoaderData,
} from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { fetchChats } from "@/features/chats/services/chat.service";
import { useFetchChats } from "@/features/chats/hooks/useFetchChats";
import { ChatList } from "@/features/chats/components/chatList";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import { useChatLayoutStore } from "@/app/store/chat-layout.store";

export const Route = createFileRoute("/(authenticated)/chats")({
	loader: async () => {
		const initialData = (await fetchChats(1, 10));
		return { initialData };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { initialData } = useLoaderData({ from: "/(authenticated)/chats" });
	const { error, refetch } = useFetchChats(initialData);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const { showSidebar, setShowSidebar } = useChatLayoutStore();

	useEffect(() => {
		setShowSidebar(!isMobile);
	}, [isMobile, setShowSidebar]);

	const handleItemClick = () => {
		if (isMobile) {
			setShowSidebar(false);
		}
	};

	return (
		<div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col pt-4 container mx-auto max-w-7xl px-0 sm:px-4">
			<div className="flex-1 flex overflow-hidden rounded-xl border bg-card shadow-sm ring-1 ring-border/50">
				{/* Left Sidebar - Chat List */}
				<aside
					className={`
            ${isMobile
							? `fixed inset-y-0 left-0 z-50 w-full max-w-[320px] bg-background shadow-xl transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"
							}`
							: "relative w-80 lg:w-96 flex flex-col border-r bg-muted/10"
						}
          `}
				>
					{/* Sidebar Header */}
					<div className="px-4 py-3 border-b flex items-center justify-between h-16 shrink-0 bg-background/50 backdrop-blur-sm">
						<h1 className="text-xl font-semibold tracking-tight">Messages</h1>
						{isMobile && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setShowSidebar(false)}
								className="h-8 w-8"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>

					{/* Chat List Area */}
					<div className="flex-1 overflow-y-auto custom-scrollbar">
						{useFetchChats(initialData).isLoading ? (
							<div className="p-4 space-y-4">
								<Pending resource="conversations" />
							</div>
						) : error ? (
							<div className="p-4">
								<ErrorState
									message={error.message || "Failed to load conversations"}
									onRetry={refetch}
								/>
							</div>
						) : (
							<ChatList onItemClick={handleItemClick} />
						)}
					</div>
				</aside>

				{/* Main Content - Chat Window */}
				<main className="flex-1 flex flex-col bg-background relative overflow-hidden">
					<Outlet />
				</main>

				{/* Mobile Overlay */}
				{isMobile && showSidebar && (
					<div
						className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
						onClick={() => setShowSidebar(false)}
					/>
				)}
			</div>
		</div>
	);
}
