import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import { queryClient } from "@/app/router/routerConfig";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import type { Notification } from "@/shared/types/notifications";

export function registerNotificationEvents(socket: Socket) {
	socket.on(SOCKET_EVENTS.NOTIFICATION.NEW, (data: Notification) => {
		toast.info(data.content);

		const newNotification: Notification = {
			...data,
			isRead: false,
		};

		//  Optimistically update the cache
		queryClient.setQueryData(["notifications"], (oldData: any) => {
			if (!oldData || !oldData.pages || oldData.pages.length === 0) {
				return oldData;
			}

			// Get the current first page.
			const firstPage = oldData.pages[0];

			// Create new first page with the prepended notification
			const newFirstPage = {
				...firstPage,
				// Prepend the new notification to the existing array.
				notifications: [newNotification, ...firstPage.notifications],
				// Increment the total and unread counts.
				total: firstPage.total + 1,
				unreadCount: firstPage.unreadCount + 1,
			};

			return {
				...oldData,
				pages: [newFirstPage, ...oldData.pages.slice(1)],
			};
		});
	});
}
