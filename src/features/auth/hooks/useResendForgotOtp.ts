import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { resendResetOtp } from "../services/auth.service";

export interface ResendOtpData {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

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
