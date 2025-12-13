import { minutesToTime } from "@/shared/utils/dateUtil";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpdateMentorRule } from "../hooks/mentor-dashboard-mutations.hooks";
import type { Rule } from "@/shared/types/session";

export default function UpdateRuleDialog({ mentorId, rule }: { mentorId: string; rule: Rule }) {
  const [open, setOpen] = useState(false);
  const [updatedRule, setUpdatedRule] = useState({
    ruleId: rule.ruleId,
    weekDay: rule.weekDay,
    startTime: minutesToTime(Number(rule.startTime)),
    endTime: minutesToTime(Number(rule.endTime)),
    slotDuration: rule.slotDuration,
  });

  const updateMentorRuleMutation = useUpdateMentorRule(mentorId)

  // Watch for duration/startTime changes to auto-update end time
  useEffect(() => {
    if (updatedRule.startTime && updatedRule.slotDuration) {
      const [hours, minutes] = updatedRule.startTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes + Number(updatedRule.slotDuration));

      const newEndHours = String(date.getHours()).padStart(2, '0');
      const newEndMinutes = String(date.getMinutes()).padStart(2, '0');
      const newEndTime = `${newEndHours}:${newEndMinutes}`;

      if (updatedRule.endTime !== newEndTime) {
        setUpdatedRule(prev => ({ ...prev, endTime: newEndTime }));
      }
    }
  }, [updatedRule.startTime, updatedRule.slotDuration]);


  const handleUpdateRule = () => {
    // Send payload directly as partial rule with string times as requested
    const payload = {
      weekDay: updatedRule.weekDay,
      startTime: updatedRule.startTime,
      endTime: updatedRule.endTime,
      slotDuration: updatedRule.slotDuration
    };

    updateMentorRuleMutation.mutate({
      ruleId: rule.ruleId,
      updatedRule: payload
    }, {
      onSuccess: () => {
        setOpen(false)
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Session Rule</DialogTitle>
          <DialogDescription>
            Update the rule for your session availability
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="weekDay" className="text-right">
              Day
            </label>
            <Select
              value={updatedRule.weekDay.toString()}
              onValueChange={(value) => setUpdatedRule({ ...updatedRule, weekDay: parseInt(value) })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
                <SelectItem value="6">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="startTime" className="text-right">
              Start Time
            </label>
            <Input
              id="startTime"
              type="time"
              value={updatedRule.startTime}
              onChange={(e) => setUpdatedRule({ ...updatedRule, startTime: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endTime" className="text-right">
              End Time
            </label>
            <Input
              id="endTime"
              type="time"
              value={updatedRule.endTime}
              readOnly
              className="col-span-3 bg-muted"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="slotDuration" className="text-right">
              Slot Duration
            </label>
            <Select
              value={updatedRule.slotDuration.toString()}
              onValueChange={(value) => setUpdatedRule({ ...updatedRule, slotDuration: parseInt(value) as 60 | 90 | 120 | 180 })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateRule} disabled={updateMentorRuleMutation.isPending}>
            {updateMentorRuleMutation.isPending ? "Updating..." : "Update Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
