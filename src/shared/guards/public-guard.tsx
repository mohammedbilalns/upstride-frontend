import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/app/store/auth.store";

/**
 * Blocks authenticated users from accessing public routes (e.g., /auth, /register).
 */
export function publicGuard() {
	return async () => {
		const { isLoggedIn } = useAuthStore.getState();
		if (isLoggedIn) {
			throw redirect({
				to: "/home",
			});
		}
	};
}
