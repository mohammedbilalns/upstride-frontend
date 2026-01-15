import { createFileRoute } from "@tanstack/react-router";
import { getMentor } from "@/features/mentor-discovery/services/mentor.service";
import { authGuard } from "@/shared/guards/auth-gaurd";
import MentorDetailsPage from "@/features/mentor-discovery/pages/MentorDetailPage";

// NOTE : check 404 error 
export const Route = createFileRoute("/(authenticated)/mentors/$mentorId")({
  component: MentorDetailsPage,
  beforeLoad: authGuard(["mentor", "user"]),
  loader: async ({ params, context }) => {
    const { mentorId } = params;
    await context.queryClient.ensureQueryData({
      queryKey: ["mentor", mentorId],
      queryFn: () => getMentor(mentorId),
    });
  },
});


