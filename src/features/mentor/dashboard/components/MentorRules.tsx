import { Calendar, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import { useFetchMentorRules } from "../../hooks/mentor-rules.hooks";
import UpdateRuleDialog from "./UpdateRuleDialog";
import { formatDate } from "@/shared/utils/dateUtil";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDeleteMentorRule } from "../hooks/mentor-dashboard-mutations.hooks";

export default function MentorRules({ mentorId }: { mentorId: string }) {
  const { data, isError, isPending } = useFetchMentorRules(mentorId);

  const deleteRuleMuation = useDeleteMentorRule()
 
  const handleDeleteRule = (ruleId: string) => {
    deleteRuleMuation.mutate({ mentorId, ruleId });
  };
  
  if (isPending) {
    return <Pending resource="Mentor rules" />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!data || data?.recurringRules?.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Rules Found</h3>
        <p className="text-muted-foreground mb-4">Create your first session rule to manage your availability</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.recurringRules?.map((rule) => (
        <Card key={rule?.ruleId} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="font-medium">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][rule.weekDay]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDate(rule.startTime)} - {formatDate(rule.endTime)}
                    </span>
                  </div>
                  <div>
                    Slot Duration: {rule.slotDuration} minutes
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <UpdateRuleDialog mentorId={mentorId} rule={rule} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteRule(rule.ruleId)}
                  disabled={deleteRuleMuation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

