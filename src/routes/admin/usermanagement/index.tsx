import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/usermanagement/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/usermanagement/"!</div>;
}
