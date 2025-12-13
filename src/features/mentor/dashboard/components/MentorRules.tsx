import { Calendar, Clock, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import { useFetchMentorRules } from "../../hooks/mentor-rules.hooks";
import UpdateRuleDialog from "./UpdateRuleDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDeleteMentorRule, useDisableMentorRule, useEnableMentorRule } from "../hooks/mentor-dashboard-mutations.hooks";
import { ConfirmDialog } from "@/components/common/Confirm";
import { minutesToTime } from "@/shared/utils/dateUtil";

export default function MentorRules({ mentorId }: { mentorId: string }) {
  const { data, isError, isPending } = useFetchMentorRules(mentorId);

  const deleteRuleMuation = useDeleteMentorRule(mentorId);
  const disableRuleMutation = useDisableMentorRule(mentorId);
  const enableRuleMutation = useEnableMentorRule(mentorId);

  const handleDeleteRule = (ruleId: string) => {
    deleteRuleMuation.mutate(ruleId);
  };

  const handleToggleRule = (ruleId: string, isActive: boolean) => {
    if (isActive) {
      disableRuleMutation.mutate(ruleId);
    } else {
      enableRuleMutation.mutate(ruleId);
    }
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
        <p className="text-muted-foreground mb-4">
          Create your first session rule to manage your availability
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.recurringRules?.map((rule) => {
        const isToggling = disableRuleMutation.isPending || enableRuleMutation.isPending;

        return (
          <Card key={rule?.ruleId} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  {/* Status + Weekday */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleRule(rule.ruleId, rule.isActive ?? true)}
                        disabled={isToggling}
                        className={rule.isActive ? "text-green-500 hover:text-green-600" : "text-red-500 hover:text-red-600"}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <span className="font-medium">
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][rule.weekDay]}
                    </span>
                  </div>

                  {/* Time & Duration */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {minutesToTime(Number(rule.startTime))} – {minutesToTime(Number(rule.endTime))}
                      </span>
                    </div>
                    <div>
                      Slot Duration: {rule.slotDuration} minutes
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {rule.isActive ? (
                    <ConfirmDialog
                      title="Disable Rule?"
                      description="Are you sure you want to disable this rule? Sessions will no longer be booked for this slot."
                      confirmText="Disable"
                      cancelText="Keep Active"
                      onConfirm={() => handleToggleRule(rule.ruleId, true)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        title="Disable Rule"
                      >
                        <Power className="h-4 w-4 fill-green-600" />
                      </Button>
                    </ConfirmDialog>
                  ) : (
                    <ConfirmDialog
                      title="Enable Rule?"
                      description="Are you sure you want to enable this rule? Mentees will be able to book sessions for this slot."
                      confirmText="Enable"
                      onConfirm={() => handleToggleRule(rule.ruleId, false)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground"
                        disabled={isToggling}
                        title="Enable Rule"
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </ConfirmDialog>
                  )}

                  <UpdateRuleDialog mentorId={mentorId} rule={rule} />

                  <ConfirmDialog
                    title="Delete Rule"
                    description="Are you sure you want to delete this rule? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    onConfirm={() => handleDeleteRule(rule.ruleId)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleteRuleMuation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}
