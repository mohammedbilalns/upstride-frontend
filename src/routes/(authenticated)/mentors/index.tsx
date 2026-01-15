import MentorListPage from "@/features/mentor-discovery/pages/MentorListPage";
import { MentorsSearchSchema } from "@/features/mentor-discovery/schemas/mentorsSearchSchema";
import { mentorsQueryOptions } from "@/features/mentor-discovery/services/mentor.service";
import { authGuard } from "@/shared/guards/auth-gaurd";

import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/(authenticated)/mentors/")({
  beforeLoad: authGuard(["mentor", "user"]),
  validateSearch: (search: Record<string, string>) => {
    return MentorsSearchSchema.parse(search);
  },
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    const { user } = context.authStore.getState();
    await context.queryClient.ensureInfiniteQueryData(
      mentorsQueryOptions(
        search.query,
        search.expertiseId,
        search.skillId,
      ),
    );
    return {
      user,
    };
  },
  component: MentorListPage,
});
