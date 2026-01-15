import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { type NotificationsResponse } from "@/shared/types/notifications";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function fetchNotifications(
	page: number,
	limit: number,
	filter?: "all" | "unread",
) {
	return apiRequest(() =>
		api.get<NotificationsResponse>(API_ROUTES.NOTIFICATIONS.FETCH, {
			params: { page, limit, filter },
		}),
	);
}

export function markNotificationAsRead(id: string) {
	return apiRequest(() => api.post(API_ROUTES.NOTIFICATIONS.MARK_AS_READ(id), {
		id,
	}))
}

export function markAllNotificationsAsRead() {
	return apiRequest(() => api.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ))
}

export function markChatNotificationsAsRead(chatId: string) {
	return apiRequest(() => api.put(API_ROUTES.NOTIFICATIONS.MARK_CHAT_READ(chatId)))
}
