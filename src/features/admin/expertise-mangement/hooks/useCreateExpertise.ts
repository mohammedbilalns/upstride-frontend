import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { createExpertise } from "../services/expertise-management.service";

export const useCreateExpertise = (callbacks?: {
	onCreateSuccess?: () => void;
}) => {
	const router = useRouter();
	return useMutation({
		mutationFn: ({
			name,
			description,
			skills,
		}: {
			name: string;
			description: string;
			skills: string[];
		}) => createExpertise(name, description, skills),
		onSuccess: (response) => {
			toast.success(response.message);
			callbacks?.onCreateSuccess?.();
			router.invalidate({ sync: true });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Expertise creation failed";
			toast.error(errorMessage);
		},
	});
};
