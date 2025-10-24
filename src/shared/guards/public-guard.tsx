import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/app/store/auth.store";

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
