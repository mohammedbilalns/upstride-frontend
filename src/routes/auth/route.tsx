import { publicGuard } from "@/components/guards/public-guard";
import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layouts/header";

export const Route = createFileRoute("/auth")({
  beforeLoad: publicGuard(),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}
