import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/ui/modern-side-bar";
import { Outlet } from "@tanstack/react-router";
import { authGuard } from "@/components/guards/auth-gaurd";
import AdminNotFound from "@/features/admin/components/adminNotFound";

export const Route = createFileRoute("/admin")({
  beforeLoad: authGuard(["admin", "super_admin"]),
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
