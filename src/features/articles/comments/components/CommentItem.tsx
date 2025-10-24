import {
	ChevronDown,
	ChevronUp,
	Edit,
	Heart,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth.store";
import { ConfirmDialog } from "@/components/common/confirm";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Comment } from "@/shared/types/comment";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { useUpdateComment } from "../../hooks/useUpdateComment";
import { useCommentInteractions } from "../hooks/useCommentInteractions";
import { useCommentReplies } from "../hooks/useCommentReplies";
import { useDeleteComment } from "../hooks/useDeleteComment";
import CommentForm from "./CommentForm";
import { CommentReplies } from "./CommentReplies";
import UserAvatar from "@/components/common/UserAvatar";

interface CommentItemProps {
	comment: Comment;
	articleId: string;
	level?: number;
	parentCommentId?: string;
	onCommentUpdate?: (commentId: string, newContent: string) => void;
	onCommentDelete?: (commentId: string) => void;
}

export default function CommentItem({
	comment,
	articleId,
	level = 0,
	onCommentUpdate,
	onCommentDelete,
}: CommentItemProps) {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content || "");
	const { user } = useAuthStore();
	const isAuthor = user?.id == comment.userId;

	// Check if the comment is deleted
	const isDeleted = comment.isDeleted === true;

	// Only use interaction hooks for non-deleted comments
	const { liked, likes, handleReact, isPending } = useCommentInteractions(
		isDeleted ? undefined : comment,
	);

	const {
		showReplies,
		replies,
		isLoadingReplies,
		hasMoreReplies,
		isFetchingNextPage,
		handleToggleReplies,
		handleLoadMoreReplies,
	} = useCommentReplies(articleId, comment.id);

	const deleteCommentMutation = useDeleteComment(articleId);
	const updateCommentMutation = useUpdateComment(articleId);

	const handleEdit = () => {
		setIsEditing(true);
		setEditContent(comment.content);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditContent(comment.content);
	};

	const handleSaveEdit = async () => {
		try {
			await updateCommentMutation.mutateAsync({
				commentId: comment.id,
				content: editContent,
			});
			setIsEditing(false);
			if (onCommentUpdate) {
				onCommentUpdate(comment.id, editContent);
			}
		} catch (error) {
			console.error("Failed to update comment:", error);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteCommentMutation.mutateAsync({ commentId: comment.id });
			if (onCommentDelete) {
				onCommentDelete(comment.id);
			}
		} catch (error) {
			console.error("Failed to delete comment:", error);
		}
	};

	const hasReplies = comment.replies > 0;
	const replyText = comment.replies === 1 ? "reply" : "replies";

	return (
		<div className={level > 0 ? "ml-6 mt-4" : ""}>
			<div className="flex gap-3">
				{isDeleted && 
					<UserAvatar image={comment.userImage} name={comment.userName} size={10} />
				}

				<div className="flex-1 space-y-2">
					{/* Header */}
					<div className="flex items-center justify-between">
						<p className="font-semibold text-sm">{comment.userName}</p>
						<span className="text-xs text-muted-foreground">
							{formatRelativeTime(comment.createdAt)}
						</span>
					</div>

					{/* Content */}
					{isDeleted ? (
						<p className="text-sm text-muted-foreground italic leading-relaxed">
							This comment has been deleted
						</p>
					) : isEditing ? (
						<div className="space-y-2">
							<textarea
								value={editContent}
								onChange={(e) => setEditContent(e.target.value)}
								className="w-full p-2 border rounded-md text-sm"
								rows={3}
							/>
							<div className="flex justify-end gap-2">
								<Button variant="outline" size="sm" onClick={handleCancelEdit}>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={handleSaveEdit}
									disabled={
										!editContent.trim() || updateCommentMutation.isPending
									}
								>
									{updateCommentMutation.isPending ? "Saving..." : "Save"}
								</Button>
							</div>
						</div>
					) : (
						<p className="text-sm text-muted-foreground leading-relaxed">
							{comment.content}
						</p>
					)}

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
							{!isDeleted && (
								<>
									<Button
										variant={liked ? "default" : "outline"}
										size="sm"
										className="cursor-pointer"
										onClick={handleReact}
										disabled={isPending}
										aria-label={liked ? "Unlike comment" : "Like comment"}
									>
										<Heart className="h-4 w-4 mr-1" />
										{likes}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="cursor-pointer text-xs h-8 px-2"
										onClick={() => setShowReplyForm((prev) => !prev)}
									>
										Reply
									</Button>
								</>
							)}
							{isAuthor && !isDeleted && (
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
											onClick={handleEdit}
										>
											<Edit className="h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<ConfirmDialog
											title="Delete comment"
											description="Are you sure you want to delete this comment? This action cannot be undone."
											confirmText="Delete"
											cancelText="Cancel"
											variant="destructive"
											icon={<Trash2 className="h-4 w-4 text-destructive" />}
											onConfirm={handleDelete}
										>
											<DropdownMenuItem
												className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
												onSelect={(e) => e.preventDefault()}
											>
												<Trash2 className="h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</ConfirmDialog>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</div>

					{/* Reply Form */}
					{showReplyForm && !isDeleted && (
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
				parentCommentId={comment.id}
			/>
		</div>
	);
}
