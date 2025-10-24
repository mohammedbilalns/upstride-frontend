import { createFileRoute, Outlet } from "@tanstack/react-router";
import { publicGuard } from "@/shared/guards/public-guard";

export const Route = createFileRoute("/(public)/auth")({
	beforeLoad: publicGuard(),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
