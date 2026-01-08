import { createFileRoute } from "@tanstack/react-router";
import SessionsPage from "@/features/sessions/pages/SessionsPage";

export const Route = createFileRoute("/(authenticated)/sessions")({
	component: SessionsPage,
});
