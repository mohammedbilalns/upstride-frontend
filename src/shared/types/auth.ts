import type { User } from "./user";

export interface loginData {
	email: string;
	password: string;
}
export interface AuthState {
	user: User | null;
	accessToken: string | null;
	isLoggedIn: boolean;
	setUser: (user: User) => void;
	setAccessToken: (token: string) => void;
	clearUser: () => void;
}
