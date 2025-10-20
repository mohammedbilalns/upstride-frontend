import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import type { ApiError } from "@/shared/types";
import { logout } from "../services/auth.service";
import { useSocketStore } from "@/app/store/socket.store";

export const useLogout = () => {
	const { clearUser } = useAuthStore();
	const router = useRouter();
	const {disconnect} = useSocketStore()

	return useMutation({
		mutationFn: () => logout(),
		onSuccess: (response) => {
			clearUser();
			disconnect()
			toast.success(response.message);
			router.navigate({ to: "/auth" });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Logout failed";
			toast.error(errorMessage);
		},
	});
};
