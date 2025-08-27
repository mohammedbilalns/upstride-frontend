import { useMutation } from "@tanstack/react-query";
import type { loginFormValues } from "../validations";
import {
  initiatePasswordReset,
  resendRegisterOtp,
  resendResetOtp,
  updatePassword,
  userLogin,
  verifyResetOtp,
} from "../services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

export const useLogin = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: loginFormValues) => userLogin(data),
    onSuccess: (response) => {
      setUser(response.user);
      toast.success(response.message || "Login successful");
      router.navigate({ to: "/" });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    },
  });
};

export const useResendRegisterOtp = () => {
  return useMutation({
    mutationFn: (data) => resendRegisterOtp(data),
  });
};

export const useIntiatePasswordReset = () => {
  return useMutation({
    mutationFn: (data) => initiatePasswordReset(data),
  });
};

export const useVerifyResetOtp = () => {
  return useMutation({
    mutationFn: (data) => verifyResetOtp(data),
  });
};

export const useResendResetOtp = () => {
  return useMutation({
    mutationFn: (data) => resendResetOtp(data),
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data) => updatePassword(data),
  });
};
