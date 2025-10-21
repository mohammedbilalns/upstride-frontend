import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function fetchNotifications(page: number, limit: number) {
	try {
		const response = await api.get(API_ROUTES.NOTIFICATIONS.FETCH, {
			params: { page, limit },
		});
		return response.data;
	} catch (err) {
		console.error("error while fetching notifications", err);
		throw err;
	}
}

export async function markNotificationAsRead(id: string) {
	try {
		const response = await api.post(API_ROUTES.NOTIFICATIONS.MARK_READ(id), {
			id,
		});
		return response.data;
	} catch (err) {
		console.error("error while marking notification as read", err);
		throw err;
	}
}
export async function markAllNotificationsAsRead() {
	try {
		const response = await api.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_AS_READ);
		return response.data;
	} catch (err) {
		console.error("error while marking all notifications as read", err);
		throw err;
	}
}
