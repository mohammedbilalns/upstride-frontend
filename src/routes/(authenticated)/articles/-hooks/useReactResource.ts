import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import type { Article } from "@/types/article";
import type { Comment } from "@/types/comment";
import type { ReactionMutationParams } from "@/types/reaction";
import { reactResource } from "../-services/reaction.service";

const getOptimisticArticleData = (
	oldData: { article: Article; isLiked: boolean } | undefined,
	reaction: "like" | "dislike",
) => {
	if (!oldData) return oldData;
	const isLiked = reaction === "like";
	const likeChange = isLiked ? 1 : -1;

	return {
		...oldData,
		article: {
			...oldData.article,
			likes: oldData.article.likes + likeChange,
		},
		isLiked,
	};
};

const getOptimisticCommentData = (
	oldData: any,
	commentId: string,
	reaction: "like" | "dislike",
) => {
	if (!oldData) return oldData;
	const likeChange = reaction === "like" ? 1 : -1;

	const updateComment = (comment: Comment) =>
		comment.id === commentId
			? { ...comment, likes: comment.likes + likeChange }
			: comment;

	if (oldData.pages) {
		return {
			...oldData,
			pages: oldData.pages.map((page: any) => ({
				...page,
				comments: page.comments.map(updateComment),
			})),
		};
	}

	if (oldData.comments) {
		return {
			...oldData,
			comments: oldData.comments.map(updateComment),
		};
	}

	return oldData;
};

export const useReactResource = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			resourceId,
			reaction,
			resourceType,
		}: ReactionMutationParams) =>
			reactResource(resourceId, reaction, resourceType),

		onMutate: async ({ resourceId, reaction, resourceType }) => {
			// Determine the query key for the resource
			const queryKey =
				resourceType === "article"
					? ["article", resourceId]
					: ["comments", resourceId];

			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey });

			// Snapshot the previous data
			const previousData = queryClient.getQueryData(queryKey);

			//  update the cache
			queryClient.setQueryData(queryKey, (oldData: any) => {
				if (resourceType === "article") {
					return getOptimisticArticleData(oldData, reaction);
				}
				if (resourceType === "comment") {
					return getOptimisticCommentData(oldData, resourceId, reaction);
				}
				return oldData;
			});

			// Return context with the snapshot
			return { previousData, queryKey };
		},

		onError: (error: ApiError, _variables, context) => {
			// Revert the cache to the previous state
			if (context?.previousData) {
				queryClient.setQueryData(context.queryKey, context.previousData);
			}
			toast.error(
				error?.response?.data?.message || "Failed to react to resource",
			);
		},

		onSettled: (_data, _error, variables) => {
			// Invalidate the query
			const queryKey =
				variables.resourceType === "article"
					? ["article", variables.resourceId]
					: ["comments", variables.resourceId];

			queryClient.invalidateQueries({ queryKey, refetchType: "none" });
		},
	});
};
