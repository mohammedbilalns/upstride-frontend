import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useFetchComments } from "../../hooks/useFetchComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Pending from "@/components/common/pending";
import ErrorState from "@/components/common/ErrorState";

interface CommentListProps {
	articleId: string;
	commentsCount: number;
}

const COMMENTS_PER_PAGE = 10;

export default function CommentsList({
	articleId,
	commentsCount,
}: CommentListProps) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isPending,
		isError,
		refetch,
	} = useFetchComments(articleId, COMMENTS_PER_PAGE, undefined, true);

	const allComments = useMemo(
		() => data?.pages.flatMap((page) => page.comments) || [],
		[data],
	);

	const totalComments = commentsCount;

	return (
		<section>
			<h2 className="text-2xl font-bold mb-6 tracking-tight">
				Comments ({totalComments})
			</h2>
			<CommentForm articleId={articleId} />

			{isPending ? (
				<Pending resource="comments" />
			) : isError ? (
				<ErrorState
					message="Failed to load comments"
					onRetry={() => refetch()}
				/>
			) : (
				<div className="space-y-6">
					{allComments.map((comment) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							articleId={articleId}
						/>
					))}
				</div>
			)}
			{hasNextPage && (
				<div className="flex justify-center mt-8">
					<Button
						onClick={() => fetchNextPage()}
						className="cursor-pointer"
						disabled={isFetchingNextPage}
						variant="outline"
					>
						{isFetchingNextPage ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Loading...
							</>
						) : (
							"Load More Comments"
						)}
					</Button>
				</div>
			)}
		</section>
	);
}
