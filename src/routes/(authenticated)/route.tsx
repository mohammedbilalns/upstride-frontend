import { createFileRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/layouts/Navbar";
import { fetchNotifications } from "@/features/notifications/services/notification.service";
import { authGuard } from "@/shared/guards/auth-gaurd";

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
			// TODO: Specify proper types here
			getNextPageParam: (lastPage, _allPages, lastPageParam) => {
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
