import {
	ChevronDown,
	ChevronUp,
	Edit,
	Heart,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentActionsProps {
	repliesCount: number;
	showReplies: boolean;
	liked: boolean;
	likes: number;
	isPending: boolean;
	onToggleReplies: () => void;
	onReact: () => void;
	onReply: () => void;
	isAuthor?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
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
	isAuthor = false,
	onEdit,
	onDelete,
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
					className="cursor-pointer"
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
					className=" cursor-pointer text-xs h-8 px-2"
					onClick={onReply}
				>
					Reply
				</Button>
				{isAuthor && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="cursor-pointer h-8 w-8 p-0"
								aria-label="More options"
							>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								className="cursor-pointer flex items-center gap-2"
								onClick={onEdit}
							>
								<Edit className="h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
								onClick={onDelete}
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
}
