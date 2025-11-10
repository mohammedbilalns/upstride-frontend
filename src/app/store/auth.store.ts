import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthState, User } from "@/shared/types";

/**
 * Zustand store for authentication state management.
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,

        /** Set the authenticated user and mark as logged in */
        setUser: (user: User) =>
          set(() => ({
            user,
            isLoggedIn: true,
          })),

        /** Clear user session and mark as logged out */
        clearUser: () =>
          set(() => ({
            user: null,
            isLoggedIn: false,
          })),
      }),
      {
        name: "auth-storage", 
      },
    ),
    { name: "AuthStore" },
  ),
);

