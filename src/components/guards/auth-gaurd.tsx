import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

const roleRedirects: Record<string, string> = {
  user: "/",
  mentor: "/expert/dashboard",
  admin: "/admin/dashboard",
  superadmin: "/admin/dashboard",
};

export function authGuard(allowedRoles?: string[]) {
  return async () => {
    const { user, isLoggedIn } = useAuthStore.getState();
    if (!isLoggedIn) {
      throw redirect({
        to: "/auth",
      });
    }

    if (user && allowedRoles && !allowedRoles.includes(user?.role)) {
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        const fallback = roleRedirects[user.role] ?? "/unauthorized";
        throw redirect({ to: fallback });
      }
    }
  };
}
