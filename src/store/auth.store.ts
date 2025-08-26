import { create } from "zustand";
import type { AuthState, User } from "@/types";
import { devtools, persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,

        setUser: (user: User) =>
          set(() => ({
            user,
            isLoggedIn: true,
          })),

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
  ),
);
