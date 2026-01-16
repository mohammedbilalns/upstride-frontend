import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authGuard } from "@/shared/guards/auth-gaurd";
import MentorRules from "@/features/mentor-portal/components/MentorRules";
import AddRuleDialog from "@/features/mentor-portal/components/AddRuleDialog";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/(authenticated)/mentor/settings/availability")({
  component: AvailabilitySettingsPage,
  beforeLoad: authGuard(["mentor"]),
  loader: async ({ context }) => {
    const user = context.authStore.getState().user;
    if (!user || !user.mentorId) throw new Error("Mentor not found");
    return { mentorId: user.mentorId };
  }
});

function AvailabilitySettingsPage() {
  const { mentorId } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recurring Rules
            </CardTitle>
            <AddRuleDialog mentorId={mentorId} />
          </div>
          <CardDescription>
            Define your weekly recurring availability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MentorRules mentorId={mentorId} />
        </CardContent>
      </Card>
    </div>
  );
}
