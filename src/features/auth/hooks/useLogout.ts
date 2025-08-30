import { useAuthStore } from "@/store/auth.store";
import { logout } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import type { ApiError } from "@/types";

export const useLogout = () => {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: (response) => {
      clearUser();
      toast.success(response.message);
      router.navigate({ to: "/auth" });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || "Logout failed";
      toast.error(errorMessage);
    },
  });
};
