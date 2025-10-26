import { Check, CheckCheck } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

interface ChatMessageProps {
	message: {
		id: string;
		content: string;
		timestamp: string;
		isOwn: boolean;
		isRead?: boolean;
	};
	isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
	const formatTime = (timestamp: string) => {
		return new Date(timestamp).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
			<div
				className={`flex max-w-[80%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}
			>
				{!isOwn && <UserAvatar image="" name="User" size={8} />}

				<div
					className={`rounded-lg px-4 py-2 ${
						isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
					}`}
				>
					<p className="text-sm">{message.content}</p>

					<div
						className={`flex items-center mt-1 space-x-1 ${
							isOwn ? "justify-end" : "justify-start"
						}`}
					>
						<span
							className={`text-xs ${
								isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
							}`}
						>
							{formatTime(message.timestamp)}
						</span>

						{isOwn && (
							<div className="text-xs">
								{message.isRead ? (
									<CheckCheck className="h-3 w-3" />
								) : (
									<Check className="h-3 w-3" />
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
