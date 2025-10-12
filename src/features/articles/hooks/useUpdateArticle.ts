import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { articleUpdateData } from "../schemas/article.schema";
import { updateArticle } from "../services/article.service";

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
		}) => updateArticle(articleId, data),
		onSuccess: (response) => {
			toast.success(response.message);
			callbacks?.onUpdateSuccess?.();
			queryClient.invalidateQueries({
				queryKey: ["articles"],
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Article update failed";
			toast.error(errorMessage);
		},
	});
};
