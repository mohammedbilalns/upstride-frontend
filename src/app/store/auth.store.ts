import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthState, User } from "@/shared/types";

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
