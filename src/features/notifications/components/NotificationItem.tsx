import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import type { Notification } from "@/shared/types/notifications";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { cn } from "@/shared/utils/utils";
import { useMarkNotificationAsRead } from "../hooks/useMarkNotificationAsRead";
import { getNotificationIcon } from "../utils/getNotificationIcon";

interface NotificationItemProps {
	notification: Notification;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotificationItem({
	notification,
	setOpen,
}: NotificationItemProps) {
	const navigate = useNavigate();
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
		[navigate, setOpen, markNotificationAsReadMutation],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				handleNotificationClick(notification);
			}
		},
		[handleNotificationClick, notification],
	);

	const { icon: Icon, color, bgColor } = getNotificationIcon(notification.type);

	return (
		<button
			type="button"
			key={notification.id}
			className={cn(
				"p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b w-full text-left",
				!notification.isRead && "border-l-4 border-l-primary bg-muted/30",
			)}
			onClick={() => handleNotificationClick(notification)}
			onKeyDown={handleKeyDown}
			aria-label={`Notification: ${notification.title}`}
		>
			<div className="flex items-start space-x-3">
				<div className={cn("p-2 rounded-full flex-shrink-0", bgColor)}>
					<Icon className={cn("h-4 w-4", color)} />
				</div>
				<div className="flex-1 space-y-1">
					<p className={cn("text-sm", !notification.isRead && "font-semibold")}>
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
		</button>
	);
}
