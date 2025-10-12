import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, ChevronUp, Heart, User } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui";
import { formatRelativeTime } from "@/lib/dateUtil";
import type { Comment } from "@/types/comment";
import { useFetchComments } from "../-hooks/useFetchComments";
import { useReactResource } from "../-hooks/useReactResource";
import { LoadingSpinner } from "@/components/spinner";
import CommentForm from "./CommentForm";

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
	const [liked, setLiked] = useState(comment.isLiked);
	const [likes, setLikes] = useState(comment.likes);
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [showReplies, setShowReplies] = useState(false);
	const [replies, setReplies] = useState<Comment[]>([]);
	const [totalReplies, setTotalReplies] = useState(0);
	const [shouldFetchReplies, setShouldFetchReplies] = useState(false);

	const reactCommentMutation = useReactResource();

	const {
		data: repliesData,
		fetchNextPage,
		isFetchingNextPage,
		isLoading: isLoadingReplies,
	} = useFetchComments(articleId, 10, comment.id, shouldFetchReplies);

	// Memoize computed values
	const hasMoreReplies = useMemo(
		() => replies.length < totalReplies,
		[replies.length, totalReplies]
	);

	const hasReplies = comment.replies > 0;
	const replyText = comment.replies === 1 ? "reply" : "replies";

	// Toggle reply form
	const handleReply = useCallback(() => {
		setShowReplyForm(prev => !prev);
	}, []);

	// Handle like/unlike
	const handleReact = useCallback(() => {
		if (reactCommentMutation.isPending) return;

		const newLikedState = !liked;
		const newLikesCount = newLikedState ? likes + 1 : likes - 1;
		const reaction = newLikedState ? "like" : "dislike";

		// Optimistic update
		setLiked(newLikedState);
		setLikes(newLikesCount);

		reactCommentMutation.mutate(
			{ resourceId: comment.id, reaction, resourceType: "comment" },
			{
				onError: () => {
					// Revert on error
					setLiked(!newLikedState);
					setLikes(newLikedState ? newLikesCount - 1 : newLikesCount + 1);
				},
			}
		);
	}, [liked, likes, comment.id, reactCommentMutation]);

	// Toggle replies visibility
	const handleToggleReplies = useCallback(() => {
		if (!showReplies && replies.length === 0) {
			setShouldFetchReplies(true);
		}
		setShowReplies(prev => !prev);
	}, [showReplies, replies.length]);

	// Load more replies
	const handleLoadMoreReplies = useCallback(() => {
		fetchNextPage();
	}, [fetchNextPage]);

	// Update replies when new data is fetched
	useEffect(() => {
		if (!repliesData?.pages.length) return;

		const allReplies = repliesData.pages.flatMap(page => page.comments);
		
		// Only update if there are new replies
		if (allReplies.length > replies.length) {
			setReplies(allReplies);
		}

		const total = repliesData.pages[0]?.total;
		if (total !== undefined && total !== totalReplies) {
			setTotalReplies(total);
		}
	}, [repliesData, replies.length, totalReplies]);

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
					<div className="flex items-center justify-between py-2">
						<div className="flex items-center space-x-6 text-sm text-muted-foreground">
							{hasReplies && (
								<button
									type="button"
									className="flex items-center hover:text-foreground cursor-pointer transition-colors"
									onClick={handleToggleReplies}
									aria-label={showReplies ? "Hide replies" : "Show replies"}
								>
									{showReplies ? (
										<ChevronUp className="h-4 w-4 mr-1" />
									) : (
										<ChevronDown className="h-4 w-4 mr-1" />
									)}
									{comment.replies} {replyText}
								</button>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<Button
								variant={liked ? "default" : "outline"}
								size="sm"
								onClick={handleReact}
								disabled={reactCommentMutation.isPending}
								aria-label={liked ? "Unlike comment" : "Like comment"}
							>
								<Heart className="h-4 w-4 mr-1" />
								{likes}
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8 px-2"
								onClick={handleReply}
							>
								Reply
							</Button>
						</div>
					</div>

					{/* Reply Form */}
					{showReplyForm && (
						<CommentForm
							articleId={articleId}
							commentId={comment.id}
							onCancel={handleReply}
							placeholder="Reply to this comment..."
							rows={2}
							avatarSize="sm"
						/>
					)}
				</div>
			</div>

			{/* Replies Section */}
			{showReplies && (
				<div className="mt-4 space-y-4">
					{isLoadingReplies && replies.length === 0 ? (
						<LoadingSpinner />
					) : (
						<>
							{replies.map(reply => (
								<CommentItem
									key={reply.id}
									comment={reply}
									articleId={articleId}
									level={level + 1}
								/>
							))}
							{hasMoreReplies && (
								<div className="flex justify-center mt-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={handleLoadMoreReplies}
										disabled={isFetchingNextPage}
									>
										{isFetchingNextPage && <LoadingSpinner size="sm" />}
										Load more replies
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
}

