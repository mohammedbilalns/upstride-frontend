import type { InternalAxiosRequestConfig } from "axios";
import axios, { type AxiosError } from "axios";
import { useAuthStore } from "@/app/store/auth.store";
import { env } from "@/shared/constants/env";

// FIX : multiple refresh requests if Parellel req fails together
/**
 * Custom axios request config type with an internal retry flag
 * to prevent infinite loops during token refresh attempts.
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}
/**
 * Axios instance configured for the API.
 * - Includes credentials for cookie-based auth
 * - Uses a base URL from environment variables
 */
const api = axios.create({
	baseURL: env.API_URL,
	withCredentials: true,
});

/**
 * Response interceptor:
 * Handles global API errors including:
 * - 401 (Unauthorized): refreshes tokens and retries the request once
 * - 403 (Forbidden): clears user if blocked
 */
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

    // Handle expired token (401 Unauthorized)
		if (error.response?.status === 401 && !originalRequest._retry) {

      // Skip refresh for auth or expertise-related endpoints
			const isAuthEndpoint =
				(originalRequest.url?.includes("/auth") &&
					!originalRequest.url.includes("/me")) ||
				originalRequest.url?.includes("/expertise");

			if (isAuthEndpoint) {
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {

        // Attempt to refresh the access token
				await api.post("/auth/refresh");
        // Retry the original request with new tokens
				return api(originalRequest);
			} catch (refreshError) {
        // Refresh failed → log out and clear auth state
				useAuthStore.getState().clearUser();
				return Promise.reject(refreshError);
			}
		}

		if (error.response?.status === 403) {
    // Handle forbidden access (403) — blocked users
			const data = error.response.data as { message?: string };
			if (data?.message?.toLowerCase().includes("blocked")) {
				useAuthStore.getState().clearUser();
				window.location.href = "/auth/?error=blocked";
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export default api;
