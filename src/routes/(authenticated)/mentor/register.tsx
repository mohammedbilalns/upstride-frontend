import { createFileRoute } from "@tanstack/react-router";
import MentorRegisterPage from "@/features/mentor/pages/register";

export const Route = createFileRoute("/(authenticated)/mentor/register")({
	component: MentorRegisterPage,
});
