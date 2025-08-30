import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill } from "../services/expertiseManagement.service";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useCreateSkill = (callbacks?: {
  onCreateSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      expertiseId,
    }: {
      name: string;
      expertiseId: string;
    }) => createSkill(name, expertiseId),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      callbacks?.onCreateSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["skills", variables.expertiseId],
      });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Skill creation failed";
      toast.error(errorMessage);
    },
  });
};
