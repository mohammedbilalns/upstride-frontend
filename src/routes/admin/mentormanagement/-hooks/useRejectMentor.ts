import type { ApiError } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectMentor } from "../-services/mentormanagement.service";

export const useRejectMentor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectMentor(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
