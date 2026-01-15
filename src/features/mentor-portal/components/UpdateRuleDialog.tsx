import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { RecurringRule } from "@/shared/types/session";
import { useUpdateRecurringRule } from "../hooks/mentor-dashboard-mutations.hooks";

interface UpdateRuleDialogProps {
  rule: RecurringRule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateRuleDialog({
  rule,
  open,
  onOpenChange,
}: UpdateRuleDialogProps) {
  const [updatedRule, setUpdatedRule] = useState({
    startTime: rule.startTime,
    endTime: rule.endTime,
    slotDuration: rule.slotDuration,
    weekDay: rule.weekDay,
  });
  const [invalidateExisting, setInvalidateExisting] = useState(false);

  const updateRuleMutation = useUpdateRecurringRule();

  // Calculate end time whenever start time or duration changes
  useEffect(() => {
    if (updatedRule.startTime && updatedRule.slotDuration) {
      const [hours, minutes] = updatedRule.startTime.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes + Number(updatedRule.slotDuration));

      const newEndHours = String(date.getHours()).padStart(2, "0");
      const newEndMinutes = String(date.getMinutes()).padStart(2, "0");
      const newEndTime = `${newEndHours}:${newEndMinutes}`;

      if (updatedRule.endTime !== newEndTime) {
        setUpdatedRule((prev) => ({ ...prev, endTime: newEndTime }));
      }
    }
  }, [updatedRule.startTime, updatedRule.slotDuration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRuleMutation.mutate(
      {
        ruleId: rule.id,
        updatedRule: {
          startTime: updatedRule.startTime,
          endTime: updatedRule.endTime,
          slotDuration: updatedRule.slotDuration,
          weekDay: updatedRule.weekDay,
        },
        invalidateExisting,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Recurring Rule</DialogTitle>
          <DialogDescription>
            Modify the recurring availability rule
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Start Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              className="col-span-3"
              value={updatedRule.startTime}
              onChange={(e) =>
                setUpdatedRule({ ...updatedRule, startTime: e.target.value })
              }
            />
          </div>

          {/* End Time (Read Only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right">
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              className="col-span-3 bg-muted"
              value={updatedRule.endTime}
              readOnly
            />
          </div>

          {/* Slot Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slotDuration" className="text-right">
              Duration (min)
            </Label>
            <Input
              id="slotDuration"
              type="number"
              className="col-span-3"
              value={updatedRule.slotDuration}
              onChange={(e) =>
                setUpdatedRule({
                  ...updatedRule,
                  slotDuration: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Invalidate Existing Slots */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="invalidate"
              checked={invalidateExisting}
              onCheckedChange={(checked) =>
                setInvalidateExisting(checked as boolean)
              }
            />
            <Label htmlFor="invalidate" className="text-sm cursor-pointer">
              Cancel existing unbooked slots
            </Label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateRuleMutation.isPending}>
              {updateRuleMutation.isPending ? "Updating..." : "Update Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
