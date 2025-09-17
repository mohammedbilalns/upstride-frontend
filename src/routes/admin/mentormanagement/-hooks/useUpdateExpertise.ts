import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateExpertise } from "../../expertisemanagement/-services/expertiseManagement.service";
import type { ApiError } from "@/types";
export const useUpdateExpertise = (callbacks?: {
  onUpdateSuccess?: (updated: { name: string; description: string }) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
    }: {
      id: string;
      name: string;
      description: string;
    }) => updateExpertise(id, name, description),
    onSuccess: (response, variables) => {
      toast.success(response.message);

      callbacks?.onUpdateSuccess?.({
        name: variables.name,
        description: variables.description,
      });

      queryClient.invalidateQueries({
        queryKey: ["expertises"],
      });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Expertise update failed";
      toast.error(errorMessage);
    },
  });
};
