import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatList } from "./-components/chatList";
import { useChats } from "./-hooks/useChat";

export const Route = createFileRoute("/(authenticated)/chats/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { chats, isLoading } = useChats();
	console.log(chats);

	return (
		<div className="container mx-auto px-4 py-6 h-[calc(100vh-5rem)] flex flex-col">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-2xl font-bold mb-2">Messages</h1>
					<p className="text-muted-foreground">
						Connect with mentors and professionals in your network.
					</p>
				</div>
				{/* <Button> */}
				{/*   <Plus className="h-4 w-4 mr-2" /> */}
				{/*   New Chat */}
				{/* </Button> */}
			</div>

			<div className="flex flex-1 gap-6 overflow-hidden">
				{/* Chat List */}
				<div className="w-full md:w-1/3 flex flex-col border rounded-lg">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center">
							<MessageSquare className="h-5 w-5 mr-2" />
							Chats
						</CardTitle>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col p-0">
						{/* Search */}
						<div className="p-4 border-b">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Search conversations..."
									className="pl-10"
								/>
							</div>
						</div>

						{/* Filter Tabs */}
						<div className="flex border-b">
							<Button
								variant="ghost"
								className="flex-1 rounded-none border-b-2 border-primary"
							>
								All
							</Button>
							<Button variant="ghost" className="flex-1 rounded-none">
								Mentors
							</Button>
							<Button variant="ghost" className="flex-1 rounded-none">
								Users
							</Button>
						</div>

						{/* Chat List */}
						<div className="flex-1 overflow-y-auto">
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
								<ChatList />
							)}
						</div>
					</CardContent>
				</div>

				{/* Chat Area / Empty State */}
				<div className="hidden md:flex flex-1 items-center justify-center border rounded-lg bg-muted/20">
					<div className="text-center max-w-md">
						<MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold mb-2">
							Select a conversation
						</h3>
						<p className="text-muted-foreground mb-4">
							Choose a chat from the list to start messaging or create a new
							conversation.
						</p>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Start New Chat
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
