import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layouts/header";
import { authGuard } from "@/components/guards/auth-gaurd";

export const Route = createFileRoute("/(authenticated)")({
  component: RouteComponent,
  beforeLoad: authGuard(["user", "admin"]),
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
