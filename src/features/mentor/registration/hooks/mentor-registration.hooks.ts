import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { useRouter } from "@tanstack/react-router";
import type { MentorDetails, MentorProfileUpdatePayload } from "@/shared/types/mentorDetails";
import { registerMentor, updateMentorRegistration } from "../services/register-mentor.service";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";

export const useFetchMentorDetails = (enabled: boolean) => {
	return useQuery({
		queryKey: ["mentorDetails"],
		queryFn: async () => {
      // FIX : correct the api end point 
			const response = await api.get(API_ROUTES.MENTOR.GETME);
			return response.data.mentor;
		},
		staleTime: 1000 * 60,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: true,
		enabled,
	});
};

export const useRegisterAsMentor = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: (data: MentorProfileUpdatePayload) => registerMentor(data),

		onSuccess: () => {
			toast.success("Request submitted successfully");
			router.navigate({ to: "/home" });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error.response?.data?.message || "Failed to register as mentor";
			toast.error(errorMessage);
		},
	});
};

export const useUpdateMentorRegistration = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: (data: MentorDetails) => updateMentorRegistration(data),
		onSuccess: () => {
			toast.success("Request submitted successfully");
			router.navigate({ to: "/home" });
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error.response?.data?.message || "Failed to update mentor registration";
			toast.error(errorMessage);
		},
	});
};
