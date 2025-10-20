import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { articleCreateData } from "../../schemas/article.schema";
import { createArticle } from "../../services/article.service";

export const useCreateArticle = (callbacks?: {
	onCreateSuccess?: () => void;
}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: articleCreateData) => createArticle(data),
		onSuccess: (response) => {
			toast.success(response.message);
			callbacks?.onCreateSuccess?.();
			queryClient.invalidateQueries({
				queryKey: ["articles"],
			});
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Article creation failed";
			toast.error(errorMessage);
		},
	});
};
