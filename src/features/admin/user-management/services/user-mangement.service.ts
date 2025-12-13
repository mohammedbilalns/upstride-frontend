import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "@/shared/utils/apiWrapper";


export function fetchUsers(page: string, limit: string, query: string) {
	return apiRequest(() => api.get(API_ROUTES.USERMANAGEMENT.USERS, {
		params: { page, limit, query },
	}))
}

export function blockUser(userId: string) {
	return apiRequest(() => api.post(API_ROUTES.USERMANAGEMENT.BLOCK(userId)))
}

export function unblockUser(userId: string) {
	return apiRequest(() => api.post(API_ROUTES.USERMANAGEMENT.UNBLOCK(userId)))
}