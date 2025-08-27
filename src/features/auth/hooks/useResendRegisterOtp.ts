import { useMutation } from "@tanstack/react-query";
import { resendRegisterOtp } from "../services/auth.service";
import type { ApiError } from "@/types";
import { toast } from "sonner";

export const useResendRegisterOtp = (callbacks: {
  onOtpExpired?: () => void;
}) => {
  return useMutation({
    mutationFn: (data: { email: string }) => resendRegisterOtp(data),
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
