import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { unblockUser } from "../-services/usermangement.service";

export const useUnBlockUser = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: (userId: string) => unblockUser(userId),
		onSuccess: (response) => {
			toast.success(response.message);
			router.invalidate({ sync: true });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Unblock user failed";
			toast.error(errorMessage);
		},
	});
};
