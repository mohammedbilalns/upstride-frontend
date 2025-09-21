import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveMentor } from "../-services/mentormanagement.service";
import type { ApiError } from "@/types";
import { toast } from "sonner";

export const useApproveMentor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveMentor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
