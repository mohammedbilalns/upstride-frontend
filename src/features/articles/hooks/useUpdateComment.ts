import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { Comment } from "@/shared/types/comment";
import { updateComment } from "../services/comment.service";

interface CommentsPage {
	comments: Comment[];
}

export const useUpdateComment = (articleId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			commentId,
			content,
		}: {
			commentId: string;
			content: string;
		}) => updateComment(commentId, content),

		onMutate: async ({ commentId, content }) => {
			await queryClient.cancelQueries({
				queryKey: ["comments", articleId],
			});

			const previousCommentsQueries = queryClient.getQueriesData<
				InfiniteData<CommentsPage>
			>({
				queryKey: ["comments", articleId],
			});

			queryClient.setQueriesData<InfiniteData<CommentsPage>>(
				{ queryKey: ["comments", articleId] },
				(oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						pages: oldData.pages.map((page) => ({
							...page,
							comments: page.comments.map((comment) =>
								comment.id === commentId
									? { ...comment, content }
									: comment,
							),
						})),
					};
				},
			);

			return { previousCommentsQueries };
		},

		onError: (error: ApiError, _variables, context) => {
			if (context?.previousCommentsQueries) {
				for (const [queryKey, data] of context.previousCommentsQueries) {
					queryClient.setQueryData(queryKey, data);
				}
			}
			const message =
				error?.response?.data?.message || "Failed to update comment";
			toast.error(message);
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["comments", articleId],
			});
		},
	});
};
