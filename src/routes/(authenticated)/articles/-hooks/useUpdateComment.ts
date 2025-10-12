import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { updateComment } from "../-services/comment.service";

export const useUpdateComment = () => {
	return useMutation({
		mutationFn: ({
			commentId,
			content,
		}: {
			commentId: string;
			content: string;
		}) => updateComment(commentId, content),
		onSuccess: (response) => {
			console.log("Comment updated successfully:", response);
		},
		onError: (error: ApiError) => {
			const message =
				error?.response?.data?.message || "Failed to update comment";
			toast.error(message);
		},
	});
};
