import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { rejectMentor } from "../services/mentor-management.service";

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
