import type { Socket } from "socket.io-client";
import { registerNotificationEvents } from "./notification.events";
import { registerChatNotificationEvents } from "./chat.events";
import { registerSessionEvents } from "./session.events";

export function registerSocketEventHandlers(socket: Socket) {
	registerNotificationEvents(socket);
	registerChatNotificationEvents(socket);
	registerSessionEvents(socket);
}
