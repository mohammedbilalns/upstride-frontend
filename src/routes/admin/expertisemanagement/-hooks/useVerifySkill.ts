import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifySkill } from "../-services/expertiseManagement.service";
import type { ApiError } from "@/types";

export const useVerifySkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => verifySkill(id),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
