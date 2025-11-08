import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { blockUser, unblockUser } from "../services/user-mangement.service";

export const useBlockUser = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (userId: string) => blockUser(userId),
		onSuccess: (response) => {
			toast.success(response.message);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			router.invalidate();
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Block user failed";
			toast.error(errorMessage);
		},
	});
};

export const useUnBlockUser = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (userId: string) => unblockUser(userId),
		onSuccess: (response) => {
			toast.success(response.message);
			queryClient.invalidateQueries({ queryKey: ["users"] });
			router.invalidate();
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Unblock user failed";
			toast.error(errorMessage);
		},
	});
};
