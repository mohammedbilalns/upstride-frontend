import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "../../../shared/types";
import type { ForgotPasswordFormValues } from "../schemas/forgot-password.schema";
import { initiatePasswordReset, resendResetOtp, updatePassword, verifyResetOtp } from "../services/auth.service";

export interface ResendOtpData {
	email: string;
}

export interface ResendOtpResponse {
	success: boolean;
	message: string;
}

export interface VerifyForgotOtpData {
	email: string;
	otp: string;
}

export interface VerifyOtpResponse {
	success: boolean;
	message: string;
}

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

export const useResendForgotOtp = (callbacks?: {
	onOtpExpired?: () => void;
}) => {
	return useMutation<ResendOtpResponse, ApiError, ResendOtpData>({
		mutationFn: (data: ResendOtpData) => resendResetOtp(data),
		onSuccess: (response: ResendOtpResponse) => {
			toast.success(response.message);
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
