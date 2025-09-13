import MentorManagementTable from "./-components/mentorManagementTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/mentormanagement/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MentorManagementTable></MentorManagementTable>;
}
