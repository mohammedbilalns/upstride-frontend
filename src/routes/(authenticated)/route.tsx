import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authGuard } from "@/app/guards/auth-gaurd";
import Navbar from "@/components/layouts/navbar";

export const Route = createFileRoute("/(authenticated)")({
	component: RouteComponent,
	beforeLoad: authGuard(["user", "mentor"]),
});

function RouteComponent() {
	return (
		<div>
			<Navbar></Navbar>
			<Outlet />
		</div>
	);
}
