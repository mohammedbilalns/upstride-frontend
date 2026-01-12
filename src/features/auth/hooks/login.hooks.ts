import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import { useSocketStore } from "@/app/store/socket.store";
import { googleLogin, userLogin } from "../services/auth.service";
import type { ApiError } from "@/shared/types/api";
import type { loginFormValues } from "../schemas";
import type { CredentialResponse } from "@react-oauth/google";

export const useLogin = () => {
	const router = useRouter();
	const { setUser, setAccessToken } = useAuthStore();
	const { connect } = useSocketStore();

	return useMutation({
		mutationFn: (data: loginFormValues) => userLogin(data),
		onSuccess: (response) => {
			setUser(response.user);
			setAccessToken(response.accessToken);
			connect();
			router.navigate({ to: "/home" });
			toast.success(response.message);
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message || "Failed to login";
			toast.error(errorMessage);
		},
	});
};

export const useGoogleLogin = (callbacks: {
	onRegisterSuccess?: (email: string) => void;
}) => {
	const router = useRouter();
	const { setUser, setAccessToken } = useAuthStore();
	const { connect } = useSocketStore();

	return useMutation({
		mutationFn: (credentials: CredentialResponse) => googleLogin(credentials),
		onSuccess: (response) => {
			toast.success(response.message);
			if (response.message === "Registered successfully") {
				callbacks.onRegisterSuccess?.(response.email);
			} else {
				setUser(response.user);
				setAccessToken(response.accessToken);
				connect();
				router.navigate({ to: "/home" });
			}
		},
		onError: (error: ApiError) => {
			const errorMessage = error?.response?.data?.message;
			toast.error(errorMessage);
		},
	});
};
