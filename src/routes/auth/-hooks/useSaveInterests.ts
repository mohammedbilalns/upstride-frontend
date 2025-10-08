import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError } from "@/types";
import { saveInterests } from "../-services/auth.service";

export const useSaveInterests = () => {
	const { setUser } = useAuthStore();
	const router = useRouter();
	return useMutation({
		mutationFn: (data: unknown) => saveInterests(data),
		onSuccess: (response) => {
			setUser(response.user);
			router.navigate({ to: "/home" });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
		},
	});
};
