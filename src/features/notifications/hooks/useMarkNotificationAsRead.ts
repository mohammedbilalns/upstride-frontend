import {
	type InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { NotificationsResponse } from "@/shared/types/notifications";
import { markNotificationAsRead } from "../services/notification.service";

type NotificationsInfiniteData = InfiniteData<NotificationsResponse>;

export const useMarkNotificationAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => markNotificationAsRead(id),
		onSuccess: (_, variables) => {
			queryClient.setQueryData(
				["notifications"],
				(oldData: NotificationsInfiniteData) => {
					if (!oldData || !oldData.pages || oldData.pages.length === 0)
						return oldData;

					const newPages = oldData.pages.map(
						(page: NotificationsResponse, index: number) => {
							const updatedNotifications = page.notifications.map((notif) =>
								notif.id === variables ? { ...notif, isRead: true } : notif,
							);

							if (index === 0) {
								return {
									...page,
									notifications: updatedNotifications,
									unreadCount: Math.max(0, page.unreadCount - 1),
								};
							}

							return {
								...page,
								notifications: updatedNotifications,
							};
						},
					);

					return { ...oldData, pages: newPages };
				},
			);
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message || "Failed to mark notification as read";
			toast.error(errorMessage);
		},
	});
};
