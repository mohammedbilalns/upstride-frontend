import { useMutation } from "@tanstack/react-query";
import { createSkill } from "../-services/expertiseManagement.service";
import { toast } from "sonner";
import type { ApiError } from "@/types";
import { useRouter } from "@tanstack/react-router";

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
		onSuccess: (response, variables) => {
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
