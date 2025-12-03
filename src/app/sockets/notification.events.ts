import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { queryClient } from "@/app/router/routerConfig";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { Notification } from "@/shared/types/notifications";

/**
 * Registers real-time notification event listeners on the socket connection.
 * - Displays toast alerts when new notifications arrive.
 * - Optimistically updates the notifications cache.
 */
// FIX: mark notifications as read when user open's a chat  
export function registerNotificationEvents(socket: Socket) {
	socket.on(SOCKET_EVENTS.NOTIFICATION.NEW, (data: Notification) => {
    // Display toast notification
		toast.info(data.content);

		const newNotification: Notification = {
			...data,
			isRead: false,
		};

		//  Optimistically update the cache
		queryClient.setQueryData(
			["notifications"],
			(
				oldData:
					| {
							pages: {
								notifications: Notification[];
								total: number;
								unreadCount: number;
							}[];
					  }
					| undefined,
			) => {
        // If cache doesn't exist, skip updating
				if (!oldData?.pages?.length) return oldData;

				// Get the current first page.
        const [firstPage, ...restPages] = oldData.pages;

        // Create new first page with the prepended notification

        const updatedFirstPage = {
          ...firstPage,
          notifications: [newNotification, ...(firstPage.notifications || [])],
          total: (firstPage.total ?? 0) + 1,
          unreadCount: (firstPage.unreadCount ?? 0) + 1,
        };
				return {
					...oldData,
					pages: [updatedFirstPage, ...restPages],
				};
			},
		);
	});
}
