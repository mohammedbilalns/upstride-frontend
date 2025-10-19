import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "../services/profile.service";
import type { ApiError } from "@/shared/types";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      return await changePassword({ oldPassword, newPassword });
    },
    onSuccess: (data) => {
      toast.success("Password updated successfully");
      console.log("Password updated successfully", data);
    },
    onError: (error:ApiError) => {
			const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
      console.error(errorMessage);
    },
  });
};
