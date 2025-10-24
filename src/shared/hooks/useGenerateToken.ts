import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateToken } from "@/shared/services/media.service";
import type { ApiError } from "@/shared/types";

export const useGenerateToken = () => {
	return useMutation({
		mutationFn: (resource_type: string) => generateToken(resource_type),
		onSuccess: () => {},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Faied to generate token";
			toast.error(errorMessage);
		},
	});
};
