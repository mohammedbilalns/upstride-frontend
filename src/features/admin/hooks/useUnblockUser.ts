import { unblockUser } from "../services/usermangement.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useUnBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["users"] }); // invalidation neeeded ? or update the user list in the client side
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Unblock user failed";
      toast.error(errorMessage);
    },
  });
};
