import { Button } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { type Comment } from "@/types/comment";
import CommentForm from "./CommentForm";
import { formatRelativeTime } from "@/lib/dateUtil";

export default function CommentItem({
	comment,
	articleId,
	level = 0,
	onReply,
	onReact,
}: {
		comment: Comment;
		articleId: string;
		level?: number;
		onReply: (commentId: string) => void;
		onReact: (commentId: string) => void;
	}) {
	const [showReplyForm, setShowReplyForm] = useState(false);

	const handleReply = () => {
		setShowReplyForm(!showReplyForm);
		onReply(comment.id);
	};

	const handleReact = () => {
		onReact(comment.id);
	};

	return (
		<div className={`${level > 0 ? "ml-6 mt-4" : ""}`}>
			<div className="flex gap-3">
				<Avatar className="h-10 w-10">
					<AvatarImage src={comment.userImage} alt={comment.userName} />
					<AvatarFallback>
						<User className="h-5 w-5" />
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<div className="flex items-center justify-between">
						<p className="font-semibold text-sm">{comment.userName}</p>
						<span className="text-xs text-muted-foreground">
							{formatRelativeTime(comment.createdAt)}
						</span>
					</div>
					<p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>

					<div className="flex items-center justify-between py-2">
						<div className="flex items-center space-x-6 text-sm text-muted-foreground">
							{comment.replies > 0 && (
								<button
									className="flex items-center hover:text-foreground cursor-pointer transition-colors"
									onClick={() => console.log(`Fetching replies for comment ${comment.id}`)}
								>
									<MessageCircle className="h-4 w-4 mr-1" />
									{comment.replies} {comment.replies === 1 ? "reply" : "replies"}
								</button>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								className="cursor-pointer"
								onClick={handleReact}
							>
								<Heart className="h-4 w-4 mr-1" />
								{comment.likes}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="cursor-pointer text-xs h-8 px-2"
								onClick={handleReply}
							>
								Reply
							</Button>
						</div>
					</div>

					{showReplyForm && (
						<CommentForm
							articleId={articleId}
							commentId={comment.id}
							onCancel={() => setShowReplyForm(false)}
							placeholder="Reply to this comment..."
							rows={2}
							avatarSize="sm"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
