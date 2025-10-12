import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import type { CreateCommentData } from "@/types/comment";
import { createComment } from "../-services/comment.service";

export const useCreateComment = () => {
	return useMutation({
		mutationFn: ({ articleId, content, parentCommentId }: CreateCommentData) =>
			createComment(articleId, content, parentCommentId),
		onSuccess: (response) => {
			console.log("Comment created successfully:", response);
		},
		onError: (error: ApiError) => {
			const message =
				error?.response?.data?.message || "Failed to create comment";
			toast.error(message);
		},
	});
};
