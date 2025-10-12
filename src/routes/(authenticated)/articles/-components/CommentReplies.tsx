import { Button } from "@/components/ui";
import type { Comment } from "@/types/comment";
import CommentItem from "./CommentItem";
import { LoadingSpinner } from "@/components/spinner";

interface CommentRepliesProps {
	showReplies: boolean;
	replies: Comment[];
	isLoadingReplies: boolean;
	hasMoreReplies: boolean;
	isFetchingNextPage: boolean;
	articleId: string;
	level: number;
	onLoadMore: () => void;
}

export function CommentReplies({
	showReplies,
	replies,
	isLoadingReplies,
	hasMoreReplies,
	isFetchingNextPage,
	articleId,
	level,
	onLoadMore,
}: CommentRepliesProps) {
	if (!showReplies) return null;

	return (
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
								onClick={onLoadMore}
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
	);
}
