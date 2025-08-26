import type { InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh");

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      const data = error.response.data as { message?: string };
      if (data?.message?.toLowerCase().includes("blocked")) {
        alert("Your account has been blocked. Contact support.");
        window.location.href = "/auth/?error=blocked";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
