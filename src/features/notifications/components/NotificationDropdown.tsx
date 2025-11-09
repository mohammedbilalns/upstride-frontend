import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
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
import { useInfiniteScroll } from "@/shared/hooks/useInfinteScroll";
import type { NotificationsResponse } from "@/shared/types/notifications";
import { cn } from "@/shared/utils/utils";
import { useMarkAllNotificationsAsRead } from "../hooks/notifications-mutations.hooks";
import { fetchNotifications } from "../services/notification.service";
import NotificationItem from "./NotificationItem";

export function NotificationsDropdown() {
	const [open, setOpen] = useState<boolean>(false);

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

	const { setTarget } = useInfiniteScroll({
		onIntersect: fetchNextPage,
		hasNextPage: !!hasNextPage,
		isFetching: !!isFetchingNextPage,
	});

	const markAllNotificationsAsReadMutation = useMarkAllNotificationsAsRead();

	const handleMarkAllAsRead = useCallback(() => {
		markAllNotificationsAsReadMutation.mutate();
	}, [markAllNotificationsAsReadMutation]);

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
              className="cursor-pointer"
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
						return (
							<NotificationItem
								key={notification.id}
								notification={notification}
								setOpen={setOpen}
							/>
						);
					})}

					{hasNextPage && (
						<div ref={setTarget} className="flex justify-center p-4">
							{isFetchingNextPage && (
								<Loader2 className="h-6 w-6 animate-spin" />
							)}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
