import { createFileRoute } from "@tanstack/react-router";
import ExpertiseManagementTable from "@/features/admin/components/expertiseManagementTable";

export const Route = createFileRoute("/admin/expertisemanagement/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ExpertiseManagementTable />;
}
