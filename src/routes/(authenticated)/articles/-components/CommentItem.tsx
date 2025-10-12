import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Heart, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";
import { formatRelativeTime } from "@/lib/dateUtil";
import type { Comment } from "@/types/comment";
import { useReactResource } from "../-hooks/useReactResource";
import CommentForm from "./CommentForm";

interface CommentItemProps {
	comment: Comment;
	articleId: string;
	level?: number;
	onReply: (commentId: string) => void;
}

export default function CommentItem({
	comment,
	articleId,
	level = 0,
	onReply,
}: CommentItemProps) {
	const [liked, setLiked] = useState(comment.isLiked);
	const [likes, setLikes] = useState(comment.likes);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const reactCommentMutation = useReactResource();

	const handleReply = () => {
		setShowReplyForm(!showReplyForm);
		onReply(comment.id);
	};

	const handleReact = () => {
		if (reactCommentMutation.isPending) return true;
		const newLikedState = !liked;
		const newLikesCount = newLikedState ? likes + 1 : likes - 1;
		const reaction = newLikedState ? "like" : "dislike";
		setLiked(newLikedState);
		setLikes(newLikesCount);

		reactCommentMutation.mutate(
			{ resourceId: comment.id, reaction, resourceType: "comment" },
			{
				onError: () => {
					setLiked(!newLikedState);
					setLikes(newLikedState ? newLikesCount - 1 : newLikesCount + 1);
				},
			},
		);
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
					<p className="text-sm text-muted-foreground leading-relaxed">
						{comment.content}
					</p>

					<div className="flex items-center justify-between py-2">
						<div className="flex items-center space-x-6 text-sm text-muted-foreground">
							{comment.replies > 0 && (
								<button
									className="flex items-center hover:text-foreground cursor-pointer transition-colors"
									onClick={() =>
										console.log(`Fetching replies for comment ${comment.id}`)
									}
								>
									<MessageCircle className="h-4 w-4 mr-1" />
									{comment.replies}{" "}
									{comment.replies === 1 ? "reply" : "replies"}
								</button>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Button
								variant={liked ? "default" : "outline"}
								size="sm"
								className="cursor-pointer"
								onClick={handleReact}
								disabled={reactCommentMutation.isPending}
							>
								<Heart className="h-4 w-4 mr-1" />
								{likes}
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
