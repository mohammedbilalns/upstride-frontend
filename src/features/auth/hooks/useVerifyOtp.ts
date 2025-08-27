import { useMutation } from "@tanstack/react-query";
import { verifyRegisterOtp } from "../services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import type { ApiError } from "@/types";

type VerifyOtpData = {
  email: string;
  otp: string;
};

export const useVerifyOtp = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: VerifyOtpData) => verifyRegisterOtp(data),
    onSuccess: (response) => {
      setUser(response.user);
      toast.success(response.message);
      router.navigate({ to: "/" });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
