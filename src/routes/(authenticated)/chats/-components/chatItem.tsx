import { Check, CheckCheck } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";

interface ChatItemProps {
	chat: {
		id: string;
		name: string;
		avatar?: string;
		lastMessage: string;
		timestamp: string;
		unread: number;
		isOnline: boolean;
		isMentor: boolean;
		isRead: boolean;
	};
}

export function ChatItem({ chat }: ChatItemProps) {
	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

		if (diffInHours < 24) {
			return date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (diffInHours < 48) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}
	};

	return (
		<div className="p-4 cursor-pointer">
			<div className="flex items-start space-x-3">
				<div className="relative">
					<UserAvatar image={chat.avatar} name={chat.name} height={12} />
					{chat.isOnline && (
						<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
					)}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-1">
						<div className="flex items-center space-x-2">
							<h4 className="font-semibold truncate">{chat.name}</h4>
							{chat?.isMentor && (
								<Badge variant="secondary" className="text-xs">
									MENTOR
								</Badge>
							)}
						</div>
						<div className="flex items-center space-x-1">
							<span className="text-xs text-muted-foreground whitespace-nowrap">
								{formatTime(chat.timestamp)}
							</span>
							{chat.isRead ? (
								<CheckCheck className="h-3 w-3 text-muted-foreground" />
							) : (
								<Check className="h-3 w-3 text-muted-foreground" />
							)}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground truncate">
							{chat.lastMessage}
						</p>
						{chat.unread > 0 && (
							<Badge
								variant="destructive"
								className="text-xs rounded-full h-5 w-5 flex items-center justify-center p-0"
							>
								{chat.unread}
							</Badge>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
