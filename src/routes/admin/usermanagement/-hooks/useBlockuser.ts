import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { blockUser } from "../-services/usermangement.service";

export const useBlockUser = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: (userId: string) => blockUser(userId),
		onSuccess: (response) => {
			toast.success(response.message);
			router.invalidate({ sync: true });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Block user failed";
			toast.error(errorMessage);
		},
	});
};
