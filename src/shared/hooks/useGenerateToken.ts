import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateToken } from "@/shared/services/media.service";
import type { ApiError } from "@/shared/types";

/**
 * Hook for generating a secure Cloudinary upload token.
 * Provides loading/error states and displays toast.
 */
export const useGenerateToken = () => {
  return useMutation({
    // calls the backend to generate a Cloudinary upload token
    mutationFn: async (resourceType: string) => generateToken(resourceType),

    // Handle API or network errors
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message ?? "Failed to generate upload token";
      toast.error(errorMessage);
    },
  });
};

