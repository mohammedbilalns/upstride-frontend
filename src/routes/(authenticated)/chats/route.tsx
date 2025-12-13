import { useEffect, useRef } from "react";
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
  // FIX: loader data request sends twice for loader and when rendering the compnent 
  // TODO: show the mentor/ normal user indicator on each chat 
	const { initialData } = useLoaderData({ from: "/(authenticated)/chats" });
	const { error, refetch } = useFetchChats(initialData);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const { showSidebar, setShowSidebar } = useChatLayoutStore();
	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setShowSidebar(!isMobile);
	}, [isMobile, setShowSidebar]);

	useEffect(() => {
		if (chatContainerRef.current) {
			const topOffset = chatContainerRef.current.getBoundingClientRect().top;
			const bottomPadding = 0; // py-6 was changed to pt-6
			chatContainerRef.current.style.height = `calc(100dvh - ${topOffset}px - ${bottomPadding}px)`;
		}
	}, []);

	const handleItemClick = () => {
		if (isMobile) {
			setShowSidebar(false);
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
			<div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold mb-2">Chats</h1>
				</div>
			</div>
			<div
				ref={chatContainerRef}
				className="flex border bg-background rounded-xl shadow-lg overflow-hidden"
			>
				{/* Left Sidebar - Chat List */}
				<aside
					className={`
	        ${
						isMobile
							? `fixed top-16 z-30 h-[calc(100%-4rem)] w-full max-w-xs transform bg-background transition-transform duration-300 ease-in-out ${
									showSidebar ? "translate-x-0" : "-translate-x-full"
								}`
							: "relative flex w-full max-w-[350px] flex-col border-r"
					}
	      `}
				>
					<div className="flex items-center justify-between border-b p-4">
						{isMobile && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setShowSidebar(false)}
							>
								<X className="h-5 w-5" />
							</Button>
						)}
					</div>
					<div className="flex-1 overflow-y-auto">
						{useFetchChats(initialData).isLoading ? (
							<div className="p-4">
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
				<main className="flex-1 flex flex-col">
					<Outlet />
				</main>

				{/* Mobile Sidebar Overlay */}
				{isMobile && showSidebar && (
					<div
						className="fixed inset-0 top-16 z-20 bg-black/50"
						onClick={() => setShowSidebar(false)}
					/>
				)}
			</div>
		</div>
	);
}
