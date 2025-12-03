import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/app/store/auth.store";
import type { UserRole } from "../types";

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
		const { user, isLoggedIn } = useAuthStore.getState();
		if (!isLoggedIn) {
			throw redirect({
				to: "/auth",
        search:{ error: "unauthorized" }
			}
      );
		}

		if (user && allowedRoles && !allowedRoles.includes(user?.role as UserRole)) {
			if (allowedRoles && !allowedRoles.includes(user.role)) {
				const fallback = roleRedirects[user.role] ?? "/unauthorized";
				throw redirect({ to: fallback });
			}
		}
	};
}
