import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateArticle } from "../-services/article.service";
import type { ApiError } from "@/types";

export const useUpdateArticle = (callbacks?: {
  onUpdateSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
      content,
    }: {
      id: string;
      title: string;
      description: string;
      content: string;
    }) => updateArticle(id, { title, description, content }),
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
