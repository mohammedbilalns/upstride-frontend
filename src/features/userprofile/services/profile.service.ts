import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "@/shared/utils/apiWrapper";
import { queryOptions } from "@tanstack/react-query";
import { type User } from "@/shared/types/user";

export function fetchProfile(id: string) {
	return apiRequest(() => api.get<User>(API_ROUTES.PROFILE.FETCH(id)))
}

export const fetchProfileQueryOptions = (userId: string) => queryOptions({
	queryKey: ["profile", userId],
	queryFn: () => fetchProfile(userId)
})

export function updateProfile(data: unknown) {
	return apiRequest(() => api.put(API_ROUTES.PROFILE.UPDATE, data))
}

export function changePassword(data: {
	oldPassword: string;
	newPassword: string;
}) {
	return apiRequest(() => api.put(API_ROUTES.PROFILE.UPDATE_PASSWORD, data))
}

