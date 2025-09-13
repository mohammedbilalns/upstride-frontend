import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "./-components/dashboard";

export const Route = createFileRoute("/admin/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard></Dashboard>;
}
