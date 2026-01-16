import { createFileRoute } from "@tanstack/react-router";
import SessionsPage from "@/features/sessions/pages/SessionsPage";

import { authGuard } from "@/shared/guards/auth-gaurd";
import { upcomingSessionsQueryOptions, historySessionsQueryOptions } from "@/features/sessions/services/session.service";

export const Route = createFileRoute("/(authenticated)/sessions")({
	component: SessionsPage,
	beforeLoad: authGuard(["user", "mentor"]),
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(upcomingSessionsQueryOptions),
			context.queryClient.ensureQueryData(historySessionsQueryOptions),
		]);
		return;
	}
});
