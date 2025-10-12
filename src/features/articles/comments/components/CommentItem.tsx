import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { User } from "lucide-react";
import { useState } from "react";
import type { Comment } from "@/shared/types/comment";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { useCommentInteractions } from "../hooks/useCommentInteractions";
import { useCommentReplies } from "../hooks/useCommentReplies";
import { CommentActions } from "./CommentActions";
import CommentForm from "./CommentForm";
import { CommentReplies } from "./CommentReplies";

interface CommentItemProps {
	comment: Comment;
	articleId: string;
	level?: number;
}

export default function CommentItem({
	comment,
	articleId,
	level = 0,
}: CommentItemProps) {
	const [showReplyForm, setShowReplyForm] = useState(false);

	const { liked, likes, handleReact, isPending } =
		useCommentInteractions(comment);

	const {
		showReplies,
		replies,
		isLoadingReplies,
		hasMoreReplies,
		isFetchingNextPage,
		handleToggleReplies,
		handleLoadMoreReplies,
	} = useCommentReplies(articleId, comment.id);

	return (
		<div className={level > 0 ? "ml-6 mt-4" : ""}>
			<div className="flex gap-3">
				<Avatar className="h-10 w-10">
					<AvatarImage src={comment.userImage} alt={comment.userName} />
					<AvatarFallback>
						<User className="h-5 w-5" />
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 space-y-2">
					{/* Header */}
					<div className="flex items-center justify-between">
						<p className="font-semibold text-sm">{comment.userName}</p>
						<span className="text-xs text-muted-foreground">
							{formatRelativeTime(comment.createdAt)}
						</span>
					</div>

					{/* Content */}
					<p className="text-sm text-muted-foreground leading-relaxed">
						{comment.content}
					</p>

					{/* Actions */}
					<CommentActions
						repliesCount={comment.replies}
						showReplies={showReplies}
						liked={liked}
						likes={likes}
						isPending={isPending}
						onToggleReplies={handleToggleReplies}
						onReact={handleReact}
						onReply={() => setShowReplyForm((prev) => !prev)}
					/>

					{/* Reply Form */}
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

			{/* Replies Section */}
			<CommentReplies
				showReplies={showReplies}
				replies={replies}
				isLoadingReplies={isLoadingReplies}
				hasMoreReplies={hasMoreReplies}
				isFetchingNextPage={isFetchingNextPage}
				articleId={articleId}
				level={level}
				onLoadMore={handleLoadMoreReplies}
			/>
		</div>
	);
}
