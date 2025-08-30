import MentorManagementTable from "@/features/admin/components/mentorManagementTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/mentormanagement/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MentorManagementTable></MentorManagementTable>;
}
