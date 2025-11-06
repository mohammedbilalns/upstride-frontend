import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchExpertiseAreas, saveInterests } from "../services/auth.service";
import { useRouter } from "@tanstack/react-router";
import {type  ApiError } from "@/shared/types";
import { toast } from "sonner";
import { useSocketStore } from "@/app/store/socket.store";
import { useAuthStore } from "@/app/store/auth.store";

export const useFetchExpertiseAreas = () => {
	return useQuery({
		queryKey: ["expertiseAreas"],
		queryFn: () => fetchExpertiseAreas(),
	});
};

export const useSaveInterests = () => {
	const { setUser } = useAuthStore();
	const { connect } = useSocketStore();

	const router = useRouter();
	return useMutation({
		mutationFn: (data: unknown) => saveInterests(data),
		onSuccess: (response) => {
			setUser(response.user);
			connect();
			router.navigate({ to: "/home" });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
		},
	});
};
