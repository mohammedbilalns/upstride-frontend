import { ArrowLeft, Info, MoreHorizontal, Phone, Video } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
	chat: {
		id: string;
		name: string;
		avatar?: string;
		isOnline: boolean;
		isMentor: boolean;
	};
	onBack: () => void;
}

export function ChatHeader({ chat, onBack }: ChatHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center space-x-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={onBack}
					className="md:hidden"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>

				<div className="relative">
					<UserAvatar image={chat.avatar} name={chat.name} size={10} />
					{chat.isOnline && (
						<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
					)}
				</div>

				<div>
					<div className="flex items-center space-x-2">
						<h2 className="font-semibold">{chat.name}</h2>
						{chat.isMentor && (
							<Badge variant="secondary" className="text-xs">
								MENTOR
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						{chat.isOnline ? "Online now" : "Offline"}
					</p>
				</div>
			</div>

			<div className="flex items-center space-x-2">
				<Button variant="ghost" size="icon">
					<Phone className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon">
					<Video className="h-4 w-4" />
				</Button>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Info className="h-4 w-4 mr-2" />
							View Profile
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Phone className="h-4 w-4 mr-2" />
							Call
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Video className="h-4 w-4 mr-2" />
							Video Call
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
