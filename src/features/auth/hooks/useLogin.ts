import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import type { ApiError } from "@/shared/types/api";
import type { loginFormValues } from "../schemas";
import { userLogin } from "../services/auth.service";

export const useLogin = () => {
	const router = useRouter();
	const { setUser } = useAuthStore();

	return useMutation({
		mutationFn: (data: loginFormValues) => userLogin(data),
		onSuccess: (response) => {
			setUser(response.user);
			toast.success(response.message);
			router.navigate({ to: "/home" });
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to login";
			toast.error(errorMessage);
		},
	});
};
