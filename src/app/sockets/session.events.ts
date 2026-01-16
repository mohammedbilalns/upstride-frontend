import { toast } from "sonner";
import { SOCKET_EVENTS } from "@/shared/constants/events";
import { router } from "@/app/router/routerConfig";
import type { Socket } from "socket.io-client";

export function registerSessionEvents(socket: Socket) {
	socket.on(SOCKET_EVENTS.SESSION.STARTED, (data: { sessionId: string }) => {
		toast("Session Started", {
			description: "Your session has started. Click to join.",
			action: {
				label: "Join Now",
				onClick: () => {
					router.navigate({
						to: "/session/$sessionId",
						params: { sessionId: data.sessionId },
					});
				},
			},
		});
	});
}
