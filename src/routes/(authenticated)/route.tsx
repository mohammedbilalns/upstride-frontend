import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authGuard } from "@/app/guards/auth-gaurd";
import Navbar from "@/components/layouts/navbar";
import { fetchNotifications } from "@/features/notifications/services/notification.service";

const NOTIFICATIONS_LIMIT = 10;
export const Route = createFileRoute("/(authenticated)")({
	component: RouteComponent,
	beforeLoad: authGuard(["user", "mentor"]),
	loader: async ({ context }) => {
		await context.queryClient.prefetchInfiniteQuery({
			queryKey: ["notifications"],
			queryFn: ({ pageParam = 1 }) =>
				fetchNotifications(pageParam, NOTIFICATIONS_LIMIT),
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages, lastPageParam) => {
				if (lastPage.notifications.length < NOTIFICATIONS_LIMIT)
					return undefined;
				return lastPageParam + 1;
			},
		});
		return {};
	},
});

function RouteComponent() {
	return (
		<div>
			<Navbar></Navbar>
			<Outlet />
		</div>
	);
}
