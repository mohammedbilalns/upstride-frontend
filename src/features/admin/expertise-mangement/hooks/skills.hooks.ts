import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import { createSkill, fetchSkills, fetchSkillsForAdmin, verifySkill } from "../services/expertise-management.service";

export const useCreateSkill = (callbacks?: {
	onCreateSuccess?: () => void;
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();
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
			queryClient.invalidateQueries({ queryKey: ["skills"] });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue adding the skill. Please try again.";
			toast.error(errorMessage);
		},
	});
};

export const useVerifySkill = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => verifySkill(id),
		onSuccess: (response) => {
			toast.success(response.message);
			queryClient.invalidateQueries({ queryKey: ["skills"] });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"We encountered an issue verifying the skill. Please try again.";
			toast.error(errorMessage);
		},
	});
};

export const useFetchSkills = (expertiseId: string) => {
	return useQuery({
		queryKey: ["skills", expertiseId],
		queryFn: () => fetchSkills(expertiseId),
		enabled: !!expertiseId,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: false,
	});
};


export const useFetchSkillsForAdmin = (expertiseId: string) => {
	return useQuery({
		queryKey: ["skills", expertiseId],
		queryFn: () => fetchSkillsForAdmin(expertiseId),
		enabled: !!expertiseId,
		staleTime: 0,
		gcTime: 0,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: false,
	});
};


