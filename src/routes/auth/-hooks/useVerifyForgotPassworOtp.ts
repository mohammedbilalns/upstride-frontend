import { useMutation } from "@tanstack/react-query";
import { verifyResetOtp } from "../-services/auth.service";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useVerifyForgotOtp = (callbacks?: {
  onOtpExpired?: () => void;
  onSuccess: () => void;
}) => {
  return useMutation({
    mutationFn: (data) => verifyResetOtp(data),
    onSuccess: (response) => {
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
