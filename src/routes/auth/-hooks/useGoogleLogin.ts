import { useAuthStore } from "@/store/auth.store";
import { googleLogin } from "../-services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import type { CredentialResponse } from "@react-oauth/google";

export const useGoogleLogin = (callbacks: { onRegisterSuccess?: (email:string) => void }) => {
  const router = useRouter();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: (credentials: CredentialResponse) => googleLogin(credentials),
    onSuccess: (response) => {
      toast.success(response.message);
      if (response.message == "Registered successfully") {	
        callbacks.onRegisterSuccess?.(response.email);
      } else {
        setUser(response.user);
        router.navigate({ to: "/home" });
      }
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
