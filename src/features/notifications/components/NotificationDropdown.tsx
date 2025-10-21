import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Bell, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { NOTIFICATIONS_LIMIT } from "@/shared/constants/common";
import type {
	Notification,
	NotificationsResponse,
} from "@/shared/types/notifications";
import { formatRelativeTime } from "@/shared/utils/dateUtil";
import { cn } from "@/shared/utils/utils";
import { useMarkAllNotificationsAsRead } from "../hooks/useMarkAllNotificationsAsRead";
import { useMarkNotificationAsRead } from "../hooks/useMarkNotificationAsRead";
import { fetchNotifications } from "../services/notification.service";
import { getNotificationIcon } from "../utils/getNotificationIcon";

export function NotificationsDropdown() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteQuery<
			NotificationsResponse,
			Error,
			InfiniteData<NotificationsResponse>,
			string[],
			number
		>({
			queryKey: ["notifications"],
			queryFn: ({ pageParam }) =>
				fetchNotifications(pageParam, NOTIFICATIONS_LIMIT),
			initialPageParam: 1,
			getNextPageParam: (lastPage, _allPages, lastPageParam) => {
				if (lastPage.notifications.length < NOTIFICATIONS_LIMIT)
					return undefined;
				return lastPageParam + 1;
			},
		});

	const markNotificationAsReadMutation = useMarkNotificationAsRead();
	const markAllNotificationsAsReadMutation = useMarkAllNotificationsAsRead();

	const handleMarkNotificationAsRead = useCallback(
		(id: string) => {
			markNotificationAsReadMutation.mutate(id);
		},
		[markNotificationAsReadMutation],
	);

	const handleMarkAllAsRead = useCallback(() => {
		markAllNotificationsAsReadMutation.mutate();
	}, [markAllNotificationsAsReadMutation]);

	const handleNotificationClick = useCallback(
		(notification: Notification) => {
			if (!notification.isRead) {
				handleMarkNotificationAsRead(notification.id);
			}

			if (notification.link) {
				setOpen(false);
				navigate({ to: notification.link });
			}
		},
		[navigate, handleMarkNotificationAsRead, setOpen],
	);

	const unreadCount = data?.pages[0]?.unreadCount ?? 0;
	const allNotifications =
		data?.pages.flatMap((page) => page.notifications) ?? [];

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative cursor-pointer">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<span
							className={cn(
								"absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground animate-pulse",
								"shadow-lg bg-destructive",
							)}
						>
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-0" align="end">
				<div className="flex items-center justify-between p-4">
					<h4 className="font-semibold">Notifications</h4>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleMarkAllAsRead}
							disabled={markAllNotificationsAsReadMutation.isPending}
						>
							Mark all as read
						</Button>
					)}
				</div>
				<Separator />
				<div className="max-h-96 overflow-y-auto">
					{status === "pending" && (
						<div className="flex justify-center p-4">
							<Loader2 className="animate-spin" />
						</div>
					)}
					{status === "error" && (
						<div className="text-destructive p-4 text-center">
							Error loading notifications
						</div>
					)}
					{status === "success" && allNotifications.length === 0 && (
						<div className="text-muted-foreground p-4 text-center">
							You're all caught up!
						</div>
					)}
					{allNotifications.map((notification) => {
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
					})}
				</div>
				{hasNextPage && (
					<>
						<Separator />
						<div className="p-2">
							<Button
								variant="ghost"
								className="w-full"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								Load More
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	);
}
