import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { updatePassword } from "../-services/auth.service";

export const useUpdatePassword = (callbacks: { onSuccess: () => void }) => {
	return useMutation({
		mutationFn: (data: { email: string; newPassword: string }) =>
			updatePassword(data),
		onSuccess: (response) => {
			toast.success(response.message);
			callbacks?.onSuccess?.();
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
		},
	});
};
