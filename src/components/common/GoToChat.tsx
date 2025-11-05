import { useNavigate } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoToChatProps {
	userId: string;
	isText?: boolean;
}

export default function GoToChat({ userId, isText = false }: GoToChatProps) {
	const navigate = useNavigate();

	const handleGoToChat = () => {
		navigate({
			to: `/chats/${userId}`,
		});
	};

	if (isText) {
		return (
			<Button
				variant="outline"
				size="sm"
				className="cursor-pointer flex-1 sm:flex-initial"
				onClick={handleGoToChat}
			>
				<MessageCircle className="h-4 w-4 mr-1" />
				Message
			</Button>
		);
	}

	return (
		<Button
			variant="ghost"
			className="cursor-pointer"
			size="icon"
			onClick={handleGoToChat}
		>
			<MessageCircle className="h-4 w-4" />
		</Button>
	);
}
