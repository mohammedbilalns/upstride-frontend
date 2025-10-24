import type { Socket } from "socket.io-client";
import { registerNotificationEvents } from "./notification.events";

export function registerSocketEventHandlers(socket: Socket) {
	registerNotificationEvents(socket);
}
