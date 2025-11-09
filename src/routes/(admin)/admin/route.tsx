import { createFileRoute, Outlet } from "@tanstack/react-router";
import AdminNotFound from "@/features/admin/components/AdminNotFound";
import { Sidebar } from "@/features/admin/components/AdminSidebar";
import { authGuard } from "@/shared/guards/auth-gaurd";

export const Route = createFileRoute("/(admin)/admin")({
	beforeLoad: authGuard(["admin", "superadmin"]),
	component: RouteComponent,
	notFoundComponent: AdminNotFound,
});

function RouteComponent() {
	return (
		<div className="flex h-screen bg-linear-to-b from-background to-muted/20">
			<Sidebar />
			<Outlet />
		</div>
	);
}
