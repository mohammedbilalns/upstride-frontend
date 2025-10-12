import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { approveMentor } from "../services/mentor-management.service";

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
