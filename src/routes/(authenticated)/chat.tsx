// src/routes/(authenticated)/chat.tsx (Parent route)
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import UserAvatar from "@/components/common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRelativeTime } from "@/shared/utils/dateUtil";

// Mock data for conversations
const mockConversations = [
	{
		id: "1",
		name: "Dr. Sarah Johnson",
		lastMessage: "Let's schedule our next session for next week.",
		timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
		unread: 2,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
		isOnline: true,
	},
	{
		id: "2",
		name: "Prof. Michael Chen",
		lastMessage: "I've reviewed your proposal and have some feedback.",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
		unread: 0,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
		isOnline: false,
	},
	{
		id: "3",
		name: "Emily Rodriguez",
		lastMessage: "Thanks for the resources! They were really helpful.",
		timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		unread: 0,
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
		isOnline: true,
	},
];

export const Route = createFileRoute("/(authenticated)/chat")({
	component: RouteComponent,
});

function RouteComponent() {
	const [conversations] = useState(mockConversations);

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
					{/* Left Sidebar - Conversations List */}
					<aside className="w-full lg:w-1/3 space-y-6 h-fit lg:h-full lg:sticky lg:top-6 self-start">
						<Card className="h-full flex flex-col">
							<CardHeader className="pb-3">
								<CardTitle>Messages</CardTitle>
							</CardHeader>
							<CardContent className="flex-1 p-0 overflow-hidden">
								<ScrollArea className="h-full">
									<div className="space-y-1 p-4">
										{conversations.map((conversation) => (
											<a
												key={conversation.id}
												href="/chat/$conversationId"
												params={{ conversationId: conversation.id }}
												className="block"
											>
												<div className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50">
													<div className="relative mr-3">
														<UserAvatar
															image={conversation.avatar}
															name={conversation.name}
															size={10}
														/>
														{conversation.isOnline && (
															<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
														)}
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between">
															<p className="text-sm font-medium truncate">
																{conversation.name}
															</p>
															<span className="text-xs text-muted-foreground">
																{formatRelativeTime(conversation.timestamp)}
															</span>
														</div>
														<p className="text-xs text-muted-foreground truncate">
															{conversation.lastMessage}
														</p>
													</div>
													{conversation.unread > 0 && (
														<div className="ml-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
															<span className="text-xs text-primary-foreground">
																{conversation.unread}
															</span>
														</div>
													)}
												</div>
											</a>
										))}
									</div>
								</ScrollArea>
							</CardContent>
						</Card>
					</aside>

					{/* Main Chat Area - Outlet for nested routes */}
					<section className="w-full lg:w-2/3 flex flex-col h-full">
						<Outlet />
					</section>
				</div>
			</main>
		</div>
	);
}
