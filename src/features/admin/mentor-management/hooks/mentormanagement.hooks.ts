import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { approveMentor, rejectMentor } from "../services/mentor-management.service";

export const useApproveMentor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveMentor(id),
    onSuccess: () => {
      toast.success("Mentor has been approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        "We encountered an issue approving the mentor. Please try again.";
      toast.error(errorMessage);
    },
  });
};

export const useRejectMentor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectMentor(id, reason),
    onSuccess: () => {
      toast.success("Mentor has been rejected.");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ||
        "We encountered an issue rejecting the mentor. Please try again.";
      toast.error(errorMessage);
    },
  });
};
