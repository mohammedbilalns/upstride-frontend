import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MessageSquare, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatList } from "./-components/chatList";
import { useChats } from "./-hooks/useChat";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";

export const Route = createFileRoute("/(authenticated)/chats")({
	component: RouteComponent,
});

function RouteComponent() {
	const { chats, isLoading } = useChats();
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
						<CardTitle className="flex items-center">
							<MessageSquare className="h-5 w-5 mr-2" />
							Chats
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col p-0 min-h-0">
						{/* Search */}
						<div className="p-4 border-b shrink-0">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Search conversations..."
									className="pl-10"
								/>
							</div>
						</div>

						{/* Chat List */}
						<div className="flex-1 overflow-y-auto min-h-0">
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<div className="text-center">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
										<p className="text-muted-foreground">
											Loading conversations...
										</p>
									</div>
								</div>
							) : (
								<ChatList
									onItemClick={() => isMobile && setShowSidebar(false)}
								/>
							)}
						</div>
					</CardContent>
				</div>

				{/* Chat Area - Outlet for nested routes */}
				<div
					className={`flex-1 min-h-0 ${isMobile ? "w-full" : ""} border rounded-lg bg-muted/20`}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
