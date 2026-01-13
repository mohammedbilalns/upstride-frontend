import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { RegisterFormValues } from "../schemas";
import { resendRegisterOtp, userRegister, verifyRegisterOtp } from "../services/auth.service";
import { useEffect, useState } from "react";

type VerifyOtpData = {
	email: string;
	otp: string;
};

export const useRegister = (callbacks?: {
	onRegisterSuccess?: (email: string) => void;
}) => {
	return useMutation({
		mutationFn: (data: RegisterFormValues) => userRegister(data),
		onSuccess: (response, variables) => {
			toast.success(response.message);
			callbacks?.onRegisterSuccess?.(variables.email);
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue during registration. Please try again.";
			toast.error(errorMessage);
		},
	});
};

export function useOtpTimer(initialOtpTime = 300, initialResendCooldown = 60) {
	const [otpTimer, setOtpTimer] = useState(initialOtpTime);
	const [resendTimer, setResendTimer] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (otpTimer > 0) setOtpTimer((prev) => prev - 1);
			if (resendTimer > 0) setResendTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [otpTimer, resendTimer]);

	const resetOtpTimer = () => setOtpTimer(initialOtpTime);
	const startResendCooldown = () => setResendTimer(initialResendCooldown);

	return {
		otpTimer,
		resendTimer,
		resetOtpTimer,
		startResendCooldown,
		isOtpExpired: otpTimer <= 0,
		canResend: resendTimer <= 0,
	};
}


export const useVerifyRegisterOtp = (callbacks?: {
	onOtpExpired?: () => void;
	onOtpVerified?: () => void;
}) => {
	return useMutation({
		mutationFn: (data: VerifyOtpData) => verifyRegisterOtp(data),
		onSuccess: (response) => {
			callbacks?.onOtpVerified?.();
			toast.success(response.message);
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue while verifying the OTP. Please try again.";
			toast.error(errorMessage);
			if (error.response?.status === 429) {
				callbacks?.onOtpExpired?.();
			}
		},
	});
};

export const useResendRegisterOtp = (callbacks: {
	onOtpExpired?: () => void;
}) => {
	return useMutation({
		mutationFn: (data: { email: string }) => resendRegisterOtp(data),
		onSuccess: (response) => {
			toast.success(response.message);
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue while resending the OTP. Please try again.";
			toast.error(errorMessage);
			if (error.response?.status === 429) {
				callbacks?.onOtpExpired?.();
			}
		},
	});
};
