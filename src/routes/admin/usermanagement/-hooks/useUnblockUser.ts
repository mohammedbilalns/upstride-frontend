import { useMutation } from "@tanstack/react-query";
import { unblockUser } from "../-services/usermangement.service";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { useRouter } from "@tanstack/react-router";

export const useUnBlockUser = () => {
	const router = useRouter()

  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: (response) => {
      toast.success(response.message);
			router.invalidate({ sync: true });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Unblock user failed";
      toast.error(errorMessage);
    },
  });
};
