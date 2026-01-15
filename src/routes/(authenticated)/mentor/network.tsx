import { createFileRoute } from "@tanstack/react-router";
import MentorNetworkPage from "@/features/mentor-portal/pages/MentorNetworkPage";
import { followersQueryOptions } from "@/features/connnections/services/connection.service";
import { authGuard } from "@/shared/guards/auth-gaurd";

export const Route = createFileRoute("/(authenticated)/mentor/network")({
  beforeLoad: authGuard(["mentor"]),
  loader: ({ context }) =>
    context.queryClient.ensureInfiniteQueryData(followersQueryOptions()),
  component: MentorNetworkPage,
});
