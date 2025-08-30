import { useAuthStore } from "@/store/auth.store";
import { redirect } from "@tanstack/react-router";

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
