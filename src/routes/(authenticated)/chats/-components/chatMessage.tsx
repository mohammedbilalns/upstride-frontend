import { Check, CheckCheck, Image, File, Mic } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

interface ChatMessageProps {
	message: {
		id: string;
		content: string;
		timestamp: string;
		isOwn: boolean;
		isRead?: boolean;
		attachments?: {
			type: "image" | "file" | "audio";
			url?: string;
			name?: string;
		}[];
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
					{message.content && <p className="text-sm">{message.content}</p>}

					{message.attachments && message.attachments.length > 0 && (
						<div className="mt-2 space-y-2">
							{message.attachments.map((attachment, index) => (
								<div
									key={index}
									className="flex items-center space-x-2 p-2 bg-background/20 rounded"
								>
									{attachment.type === "image" ? (
										<>
											<Image className="h-4 w-4" />
											<span className="text-xs">Image</span>
										</>
									) : attachment.type === "file" ? (
										<>
											<File className="h-4 w-4" />
											<span className="text-xs truncate">
												{attachment.name}
											</span>
										</>
									) : (
										<>
											<Mic className="h-4 w-4" />
											<span className="text-xs">Audio</span>
										</>
									)}
								</div>
							))}
						</div>
					)}

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
