import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentActionsProps {
	repliesCount: number;
	showReplies: boolean;
	liked: boolean;
	likes: number;
	isPending: boolean;
	onToggleReplies: () => void;
	onReact: () => void;
	onReply: () => void;
}

export function CommentActions({
	repliesCount,
	showReplies,
	liked,
	likes,
	isPending,
	onToggleReplies,
	onReact,
	onReply,
}: CommentActionsProps) {
	const hasReplies = repliesCount > 0;
	const replyText = repliesCount === 1 ? "reply" : "replies";

	return (
		<div className="flex items-center justify-between py-2">
			<div className="flex items-center space-x-6 text-sm text-muted-foreground">
				{hasReplies && (
					<button
						type="button"
						className="flex items-center hover:text-foreground cursor-pointer transition-colors"
						onClick={onToggleReplies}
						aria-label={showReplies ? "Hide replies" : "Show replies"}
					>
						{showReplies ? (
							<ChevronUp className="h-4 w-4 mr-1" />
						) : (
							<ChevronDown className="h-4 w-4 mr-1" />
						)}
						{repliesCount} {replyText}
					</button>
				)}
			</div>

			<div className="flex items-center space-x-2">
				<Button
					variant={liked ? "default" : "outline"}
					size="sm"
					onClick={onReact}
					disabled={isPending}
					aria-label={liked ? "Unlike comment" : "Like comment"}
				>
					<Heart className="h-4 w-4 mr-1" />
					{likes}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="text-xs h-8 px-2"
					onClick={onReply}
				>
					Reply
				</Button>
			</div>
		</div>
	);
}
