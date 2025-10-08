import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError } from "@/types";
import { logout } from "../-services/auth.service";

export const useLogout = () => {
	const { clearUser } = useAuthStore();
	const router = useRouter();

	return useMutation({
		mutationFn: () => logout(),
		onSuccess: (response) => {
			clearUser();
			toast.success(response.message);
			router.navigate({ to: "/auth" });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Logout failed";
			toast.error(errorMessage);
		},
	});
};
