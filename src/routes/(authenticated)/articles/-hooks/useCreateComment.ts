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
		onSuccess: (_respsonse, variables) => {
			queryclient.invalidateQueries({
				queryKey: ["comments", variables.articleId],
			});
		},
		onError: (error: ApiError) => {
			const message =
				error?.response?.data?.message || "Failed to create comment";
			toast.error(message);
		},
	});
};
