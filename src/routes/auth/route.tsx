import { createFileRoute, Outlet } from "@tanstack/react-router";
import { publicGuard } from "@/app/guards/public-guard";

export const Route = createFileRoute("/auth")({
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
