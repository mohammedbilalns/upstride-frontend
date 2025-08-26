import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";

export function authGuard(allowedRoles?: string[]) {
  return async () => {
    const { user, isLoggedIn } = useAuthStore.getState();
    if (!isLoggedIn) {
      throw redirect({
        to: "/auth",
      });
    }

    if (user && allowedRoles && !allowedRoles.includes(user?.role)) {
      throw redirect({ to: "/unauthorized" });
    }
  };
}
