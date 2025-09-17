import type { ApiError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateToken } from "@/services/media.service";

export const useGenerateToken = () => {
  return useMutation({
    mutationFn: () => generateToken(),
    onSuccess: () => {},
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Faied to generate token";
      toast.error(errorMessage);
    },
  });
};
