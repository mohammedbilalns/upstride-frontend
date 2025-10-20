import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { verifyExpertise } from "../services/expertise-management.service";

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
