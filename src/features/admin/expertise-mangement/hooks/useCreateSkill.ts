import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { createSkill } from "../services/expertise-management.service";

export const useCreateSkill = (callbacks?: {
	onCreateSuccess?: () => void;
}) => {
	const router = useRouter();
	return useMutation({
		mutationFn: ({
			name,
			expertiseId,
		}: {
			name: string;
			expertiseId: string;
		}) => createSkill(name, expertiseId),
		onSuccess: (response) => {
			toast.success(response.message);
			callbacks?.onCreateSuccess?.();
			router.invalidate({ sync: true });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Skill creation failed";
			toast.error(errorMessage);
		},
	});
};
