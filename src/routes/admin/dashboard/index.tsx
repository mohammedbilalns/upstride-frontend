import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/features/admin/components/dashboard";

export const Route = createFileRoute("/admin/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard></Dashboard>;
}
