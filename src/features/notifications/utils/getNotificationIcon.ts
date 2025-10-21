import {
	Bell,
	Book,
	CalendarCheck,
	MessageCircle,
	UserCheck,
} from "lucide-react";
import type { Notification } from "@/shared/types/notifications";

export const getNotificationIcon = (type: Notification["type"]) => {
	switch (type) {
		case "session":
			return {
				icon: CalendarCheck,
				color: "text-blue-500",
				bgColor: "bg-blue-100",
			};
		case "connection":
			return {
				icon: UserCheck,
				color: "text-green-500",
				bgColor: "bg-green-100",
			};
		case "chat":
			return {
				icon: MessageCircle,
				color: "text-purple-500",
				bgColor: "bg-purple-100",
			};
		case "article":
			return { icon: Book, color: "text-orange-500", bgColor: "bg-orange-100" };
		default:
			return { icon: Bell, color: "text-gray-500", bgColor: "bg-gray-100" };
	}
};
