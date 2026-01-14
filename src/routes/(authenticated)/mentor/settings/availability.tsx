import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authGuard } from "@/shared/guards/auth-gaurd";
import { getSelf } from "@/features/mentor/services/mentor.service";
import MentorRules from "@/features/mentor/dashboard/components/MentorRules";
import AddRuleDialog from "@/features/mentor/dashboard/components/AddRuleDialog";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/(authenticated)/mentor/settings/availability")({
  component: AvailabilitySettingsPage,
  beforeLoad: authGuard(["mentor"]),
  loader: async () => {
    return await getSelf();
  }
});

function AvailabilitySettingsPage() {
  const mentor = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recurring Rules
            </CardTitle>
            <AddRuleDialog mentorId={mentor.id} />
          </div>
          <CardDescription>
            Define your weekly recurring availability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MentorRules mentorId={mentor.id} />
        </CardContent>
      </Card>e
    </div>
  );
}
