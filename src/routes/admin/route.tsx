import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authGuard } from "@/app/guards/auth-gaurd";
import { Sidebar } from "@/features/admin/components/AdminSidebar";
import AdminNotFound from "../../features/admin/components/AdminNotFound";

export const Route = createFileRoute("/admin")({
	beforeLoad: authGuard(["admin", "superadmin"]),
	component: RouteComponent,
	notFoundComponent: AdminNotFound,
});

function RouteComponent() {
	return (
		<div className="flex h-screen bg-gradient-to-b from-background to-muted/20">
			<Sidebar />
			<Outlet />
		</div>
	);
}
