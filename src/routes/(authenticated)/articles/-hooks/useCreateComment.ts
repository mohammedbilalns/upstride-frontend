import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import type { CreateCommentData } from "@/types/comment";
import { createComment } from "../-services/comment.service";

export const useCreateComment = () => {
	const queryclient = useQueryClient();

	return useMutation({
		mutationFn: ({ articleId, content, parentCommentId }: CreateCommentData) =>
			createComment(articleId, content, parentCommentId),

		onMutate: async (variables) => {
			// Cancel any outgoing refetches for the article
			await queryclient.cancelQueries({
				queryKey: ["article", variables.articleId],
			});

			const previousArticle = queryclient.getQueryData([
				"article",
				variables.articleId,
			]);

			queryclient.setQueryData(["article", variables.articleId], (old: any) => {
				if (!old) return old;

				return {
					...old,
					article: {
						...old.article,
						comments: old.article.comments + 1,
					},
				};
			});

			return { previousArticle };
		},

		// Handle errors and roll back the optimistic update
		onError: (error: ApiError, variables, context) => {
			if (context?.previousArticle) {
				queryclient.setQueryData(
					["article", variables.articleId],
					context.previousArticle,
				);
			}

			const message =
				error?.response?.data?.message || "Failed to create comment";
			toast.error(message);
		},

		onSuccess: (_response, variables) => {
			queryclient.invalidateQueries({
				queryKey: ["comments", variables.articleId],
			});
		},
	});
};
