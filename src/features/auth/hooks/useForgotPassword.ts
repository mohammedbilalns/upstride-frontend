import { useMutation } from "@tanstack/react-query";
import { initiatePasswordReset } from "../services/auth.service";
import type { ForgotPasswordFormValues } from "../validations/forgotPasswordSchema";
import { toast } from "sonner";
import type { ApiError } from "../../../types";

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
      const errorMessage = error?.response?.data?.message || "Forgot password failed";
      toast.error(errorMessage);
    },
  });
};
