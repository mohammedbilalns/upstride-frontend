import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { createExpertise, updateExpertise, verifyExpertise } from "../services/expertise-management.service";

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

export const useUpdateExpertise = (callbacks?: {
	onUpdateSuccess?: (updated: { name: string; description: string }) => void;
}) => {
	const router = useRouter();
	return useMutation({
		mutationFn: ({
			id,
			name,
			description,
		}: {
			id: string;
			name: string;
			description: string;
		}) => updateExpertise(id, name, description),
		onSuccess: (response, variables) => {
			toast.success(response.message);

			callbacks?.onUpdateSuccess?.({
				name: variables.name,
				description: variables.description,
			});
			router.invalidate({ sync: true });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Expertise update failed";
			toast.error(errorMessage);
		},
	});
}

export const useVerifyExpertise = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => verifyExpertise(id),
		onSuccess: (response) => {
			toast.success(response.message);
			queryClient.invalidateQueries({ queryKey: ["expertises"] });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
		},
	});
};
