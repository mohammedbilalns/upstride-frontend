import { type  Notification } from "@/shared/types/notifications";
import { cn } from "@/shared/utils/utils";
import { getNotificationIcon } from "../utils/getNotificationIcon";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { useCallback } from "react";
import { useMarkNotificationAsRead } from "../hooks/useMarkNotificationAsRead";
import { useNavigate } from "@tanstack/react-router";

interface NotificationItemProps {
	notification: Notification;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotificationItem({notification, setOpen}: NotificationItemProps) {
	const navigate = useNavigate()
	const markNotificationAsReadMutation = useMarkNotificationAsRead();

	const handleNotificationClick = useCallback(
		(notification: Notification) => {
			if (!notification.isRead) {
				markNotificationAsReadMutation.mutate(notification.id);
			}

			if (notification.link) {
				setOpen(false);
				navigate({ to: notification.link });
			}
		},
		[navigate, setOpen],
	);

	const {
		icon: Icon,
		color,
		bgColor,
	} = getNotificationIcon(notification.type);

	return (
		<div
			key={notification.id}
			className={cn(
				"p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b",
				!notification.isRead &&
					"border-l-4 border-l-primary bg-muted/30",
			)}
			onClick={() => handleNotificationClick(notification)}
		>
			<div className="flex items-start space-x-3">
				<div
					className={cn("p-2 rounded-full flex-shrink-0", bgColor)}
				>
					<Icon className={cn("h-4 w-4", color)} />
				</div>
				<div className="flex-1 space-y-1">
					<p
						className={cn(
							"text-sm",
							!notification.isRead && "font-semibold",
						)}
					>
						{notification.title}
					</p>
					<p className="text-sm text-muted-foreground">
						{notification.content}
					</p>
					<p className="text-xs text-muted-foreground pt-1">
						{formatRelativeTime(notification.createdAt)}
					</p>
				</div>
				{!notification.isRead && (
					<div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
				)}
			</div>
		</div>
	);

}
