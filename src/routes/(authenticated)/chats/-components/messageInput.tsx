import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface MessageInputProps {
	onSend: (message: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
	const [message, setMessage] = useState("");

	const handleSend = () => {
		if (message.trim()) {
			onSend(message);
			setMessage("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex items-end space-x-2">
			<Button variant="ghost" size="icon">
				<Paperclip className="h-4 w-4" />
			</Button>

			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon">
						<Smile className="h-4 w-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent side="top" className="w-full p-2">
					<div className="grid grid-cols-6 gap-1">
						{["😀", "😂", "😍", "👍", "👋", "🎉"].map((emoji) => (
							<Button
								key={emoji}
								variant="ghost"
								className="h-8 w-8 p-0"
								onClick={() => setMessage((prev) => prev + emoji)}
							>
								{emoji}
							</Button>
						))}
					</div>
				</PopoverContent>
			</Popover>

			<div className="flex-1">
				<Input
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder="Type a message..."
					className="min-h-[44px]"
				/>
			</div>

			<Button onClick={handleSend} disabled={!message.trim()} size="icon">
				<Send className="h-4 w-4" />
			</Button>
		</div>
	);
}
