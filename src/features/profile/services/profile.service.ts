import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function fetchProfile(id: string) {
	return apiRequest(() => api.get(API_ROUTES.PROFILE.FETCH(id)))
}

export function updateProfile(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.PROFILE.UPDATE, data))
}

export function changePassword(data: {
	oldPassword: string;
	newPassword: string;
}) {
	return apiRequest(() => api.put(API_ROUTES.PROFILE.UPDATE_PASSWORD, data))
}

