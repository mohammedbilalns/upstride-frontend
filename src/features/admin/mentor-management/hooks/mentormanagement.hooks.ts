import { useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { approveMentor, rejectMentor } from "../services/mentor-management.service";

export const useApproveMentor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveMentor(id),
    onSuccess: () => {
      toast.success("Mentor approved successfully");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || "Failed to approve mentor";
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
      toast.success("Mentor rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
