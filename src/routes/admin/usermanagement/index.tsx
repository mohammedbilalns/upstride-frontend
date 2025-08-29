import { createFileRoute } from "@tanstack/react-router";
import UserManagementTable from "@/features/admin/components/userManagementTable";

export const Route = createFileRoute("/admin/usermanagement/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserManagementTable />;
}
