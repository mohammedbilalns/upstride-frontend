import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { deleteArticle, updateArticle } from "../services/article.service";
import type { articleUpdateData } from "../schemas/article.schema";

export const useDeleteArticle = (callbacks?: {
	onDeleteSuccess?: () => void;
}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteArticle(id),
		onSuccess: (response) => {
			toast.success(response.message);
			callbacks?.onDeleteSuccess?.();
			queryClient.invalidateQueries({
				queryKey: ["articles"],
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue while deleting the article. Please try again.";
			toast.error(errorMessage);
		},
	});
};


export const useUpdateArticle = (callbacks?: {
	onUpdateSuccess?: () => void;
}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			articleId,
			data,
		}: {
			articleId: string;
			data: articleUpdateData;
		}) => updateArticle({ id: articleId, ...data }),
		onSuccess: (response, { articleId }) => {
			toast.success(response.message);
			callbacks?.onUpdateSuccess?.();
			queryClient.invalidateQueries({
				queryKey: ["articles"],
			});
			queryClient.invalidateQueries({
				queryKey: ["article", articleId],
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue while updating the article. Please try again.";
			toast.error(errorMessage);
		},
	});
};


