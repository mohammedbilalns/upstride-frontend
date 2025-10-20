import type { CredentialResponse } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import { useSocketStore } from "@/app/store/socket.store";
import type { ApiError } from "@/shared/types";
import { googleLogin } from "../services/auth.service";

export const useGoogleLogin = (callbacks: {
	onRegisterSuccess?: (email: string) => void;
}) => {
	const router = useRouter();
	const { setUser } = useAuthStore();
	const { connect } = useSocketStore();

	return useMutation({
		mutationFn: (credentials: CredentialResponse) => googleLogin(credentials),
		onSuccess: (response) => {
			toast.success(response.message);
			if (response.message == "Registered successfully") {
				callbacks.onRegisterSuccess?.(response.email);
			} else {
				setUser(response.user);
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
