import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyExpertise } from "../-services/expertiseManagement.service";
import type { ApiError } from "@/types";
import { toast } from "sonner";

export const useVerifyExpertise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => verifyExpertise(id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["expertises"] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
