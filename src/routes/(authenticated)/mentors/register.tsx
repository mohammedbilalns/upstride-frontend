import JoinAsMentorPage from "@/features/mentor-discovery/pages/JoinAsMentorPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/mentors/register")({
  component: JoinAsMentorPage,
});


