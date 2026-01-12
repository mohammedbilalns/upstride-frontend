import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AuthState, User } from "@/shared/types";

/**
 * Zustand store for authentication state management.
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isLoggedIn: false,

        /** Set the authenticated user and mark as logged in */
        setUser: (user: User) =>
          set(() => ({
            user,
            isLoggedIn: true,
          })),

        setAccessToken: (token: string) =>
          set(() => ({
            accessToken: token,
          })),

        /** Clear user session and mark as logged out */
        clearUser: () =>
          set(() => ({
            user: null,
            accessToken: null,
            isLoggedIn: false,
          })),
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: "AuthStore" },
  ),
);

