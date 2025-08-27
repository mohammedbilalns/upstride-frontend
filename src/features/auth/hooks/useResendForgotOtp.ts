import { useMutation } from "@tanstack/react-query";
import { resendResetOtp } from "../services/auth.service";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useResendForgotOtp = (callbacks: {
  onOtpExpired?: () => void;
}) => {
  return useMutation({
    mutationFn: (data) => resendResetOtp(data),
    onSuccess: (response) => {
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
