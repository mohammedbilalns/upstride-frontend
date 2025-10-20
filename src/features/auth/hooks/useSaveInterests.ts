import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import type { ApiError } from "@/shared/types";
import { saveInterests } from "../services/auth.service";
import { useSocketStore } from "@/app/store/socket.store";

export const useSaveInterests = () => {
	const { setUser } = useAuthStore();
	const { connect } = useSocketStore()

	const router = useRouter();
	return useMutation({
		mutationFn: (data: unknown) => saveInterests(data),
		onSuccess: (response) => {
			setUser(response.user);
			connect()
			router.navigate({ to: "/home" });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
		},
	});
};
