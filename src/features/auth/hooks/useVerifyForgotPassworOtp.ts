import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { verifyResetOtp } from "../services/auth.service";

export interface VerifyForgotOtpData {
	email: string;
	otp: string;
}

export interface VerifyOtpResponse {
	success: boolean;
	message: string;
}

export const useVerifyForgotOtp = (callbacks?: {
	onOtpExpired?: () => void;
	onSuccess: () => void;
}) => {
	return useMutation<VerifyOtpResponse, ApiError, VerifyForgotOtpData>({
		mutationFn: (data: VerifyForgotOtpData) => verifyResetOtp(data),
		onSuccess: (response: VerifyOtpResponse) => {
			toast.success(response.message);
			callbacks?.onSuccess?.();
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
			if (error.response?.status === 429) {
				callbacks?.onOtpExpired?.();
			}
		},
	});
};
