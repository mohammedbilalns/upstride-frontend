import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpertise } from "../../expertisemanagement/-services/expertiseManagement.service";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useCreateExpertise = (callbacks?: {
  onCreateSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
      skills,
    }: {
      name: string;
      description: string;
      skills: string[];
    }) => createExpertise(name, description, skills),
    onSuccess: (response) => {
      toast.success(response.message);
      callbacks?.onCreateSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ["expertises"],
      });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Expertise creation failed";
      toast.error(errorMessage);
    },
  });
};
