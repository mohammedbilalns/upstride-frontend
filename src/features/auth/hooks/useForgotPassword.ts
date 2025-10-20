import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "../../../shared/types";
import type { ForgotPasswordFormValues } from "../schemas/forgot-password.schema";
import { initiatePasswordReset } from "../services/auth.service";

export const useForgotPassword = (callbacks: {
	onSuccess?: (email: string) => void;
}) => {
	return useMutation({
		mutationFn: (data: ForgotPasswordFormValues) => initiatePasswordReset(data),
		onSuccess: (response, variables) => {
			toast.success(response.message);
			callbacks?.onSuccess?.(variables.email);
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Forgot password failed";
			toast.error(errorMessage);
		},
	});
};
