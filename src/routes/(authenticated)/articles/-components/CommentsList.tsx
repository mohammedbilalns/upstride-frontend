import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui";
import { useFetchComments } from "../-hooks/useFetchComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const COMMENTS_PER_PAGE = 2;

export default function CommentsList({ articleId }: { articleId: string }) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useFetchComments(articleId, COMMENTS_PER_PAGE);

	const allComments = useMemo(
		() => data?.pages.flatMap((page) => page.comments) || [],
		[data],
	);

	const totalComments = data?.pages[0]?.total || 0;

	const handleReply = (commentId: string) => {
		console.log(`Replying to comment ${commentId}`);
	};

	return (
		<section>
			<h2 className="text-2xl font-bold mb-6 tracking-tight">
				Comments ({totalComments})
			</h2>
			<CommentForm articleId={articleId} />

			{isLoading && <p className="text-center py-4">Loading comments...</p>}
			{error && (
				<p className="text-center py-4 text-red-500">
					Failed to load comments.
				</p>
			)}

			<div className="space-y-6">
				{allComments.map((comment) => (
					<CommentItem
						key={comment.id}
						comment={comment}
						articleId={articleId}
						onReply={handleReply}
					/>
				))}
			</div>

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
