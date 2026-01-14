import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { deleteComment } from "../../services/comment.service";

export const useDeleteComment = (articleId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ commentId }: { commentId: string }) =>
			deleteComment(commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
		},
		onError: (error: ApiError) => {
			const message =
				error?.response?.data?.message ||
				"We encountered an issue while deleting the comment. Please try again.";
			toast.error(message);
		},
	});
};
