import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteArticle } from "../-services/article.service";
import type { ApiError } from "@/types";

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
        error?.response?.data?.message || "Article deletion failed";
      toast.error(errorMessage);
    },
  });
};
