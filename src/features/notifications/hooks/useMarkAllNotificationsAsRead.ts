import {
	type InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/shared/types";
import type { NotificationsResponse } from "@/shared/types/notifications";
import { markAllNotificationsAsRead } from "../services/notification.service";

type NotificationsInfiniteData = InfiniteData<NotificationsResponse>;

export const useMarkAllNotificationsAsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => markAllNotificationsAsRead(),
		onSuccess: () => {
			queryClient.setQueryData(
				["notifications"],
				(oldData: NotificationsInfiniteData) => {
					if (!oldData || !oldData.pages || oldData.pages.length === 0)
						return oldData;

					const newPages = oldData.pages.map(
						(page: NotificationsResponse, index: number) => {
							const updatedNotifications = page.notifications.map((notif) => ({
								...notif,
								isRead: true,
							}));

							if (index === 0) {
								return {
									...page,
									notifications: updatedNotifications,
									unreadCount: 0,
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
			toast.success("All notifications marked as read.");
		},
		onError: (error: ApiError) => {
			const errorMessage =
				error?.response?.data?.message ||
				"Failed to mark all notifications as read";
			toast.error(errorMessage);
		},
	});
};
