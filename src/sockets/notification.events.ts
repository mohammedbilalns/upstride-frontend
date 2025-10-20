import type { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/shared/constants/events";

export function registerNotificationEvents(socket: Socket) {
	socket.on(SOCKET_EVENTS.NOTIFICATION.NEW, (data) => {
		console.log("new notification", data);
	});
}
