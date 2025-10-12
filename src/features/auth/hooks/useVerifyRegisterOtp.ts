import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { verifyRegisterOtp } from "../services/auth.service";

type VerifyOtpData = {
	email: string;
	otp: string;
};

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
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
			if (error.response?.status === 429) {
				callbacks?.onOtpExpired?.();
			}
		},
	});
};
