import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createArticle } from "../-services/article.service";
import type { ApiError } from "@/types";

export const useCreateArticle = (callbacks?: {
  onCreateSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      description,
      content,
    }: {
      title: string;
      description: string;
      content: string;
    }) => createArticle({ title, description, content }),
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
