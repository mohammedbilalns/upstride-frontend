import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/app/store/auth.store";
import type { UserRole } from "../types";
import api from "@/api/api";

const roleRedirects: Record<UserRole, string> = {
	user: "/",
	mentor: "/",
	admin: "/admin/dashboard",
	superadmin: "/admin/dashboard",
};

type authGuardFn = () => Promise<void>;

/**
 * Protects routes based on authentication and role.
 */

export function authGuard(allowedRoles?: string[]): authGuardFn {
	return async () => {
		// Wait for store hydration if needed
		if (!useAuthStore.persist.hasHydrated()) {
			await useAuthStore.persist.rehydrate();
		}

		let { user, isLoggedIn } = useAuthStore.getState();

		if (!isLoggedIn) {
			try {
				// Attempt to restore session
				const { data: refreshData } = await api.post("/auth/refresh");
				useAuthStore.getState().setAccessToken(refreshData.accessToken);

				const { data: userData } = await api.get("/auth/me");
				useAuthStore.getState().setUser(userData.user);

				user = userData.user;
				isLoggedIn = true;
			} catch (error) {
				throw redirect({
					to: "/auth",
					search: { error: "unauthorized" },
				});
			}
		}

		if (user && allowedRoles && !allowedRoles.includes(user?.role as UserRole)) {
			if (allowedRoles && !allowedRoles.includes(user.role)) {
				const fallback = roleRedirects[user.role] ?? "/unauthorized";
				throw redirect({ to: fallback });
			}
		}
	};
}
