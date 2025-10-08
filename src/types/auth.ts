import type { User } from "./user";

export interface loginData {
	email: string;
	password: string;
}
export interface AuthState {
	user: User | null;
	isLoggedIn: boolean;
	setUser: (user: User) => void;
	clearUser: () => void;
}
