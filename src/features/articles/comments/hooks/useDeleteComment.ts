import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { deleteComment } from "../../services/comment.service";

export const useDeleteComment = () => {
	return useMutation({
		mutationFn: ({ commentId }: { commentId: string }) =>
			deleteComment(commentId),
		onSuccess: (response) => {
			console.log("Comment deleted successfully:", response);
		},
		onError: (error: ApiError) => {
			const message =
				error?.response?.data?.message || "Failed to delete comment";
			toast.error(message);
		},
	});
};
