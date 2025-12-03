import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateMentorRule } from "../hooks/mentor-dashboard-mutations.hooks";
import { Input } from "@/components/ui/input";

export default function CreateRuleDialog({mentorId }: { mentorId: string }) {
  const [open, setOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    weekDay: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 60,
  });

  const createMentorRuleMutation = useCreateMentorRule()
 
  const handleCreateRule = () => {
    createMentorRuleMutation.mutate({
      mentorId,
      rule: newRule
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Session Rule</DialogTitle>
          <DialogDescription>
            Create a new rule for your session availability
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="weekDay" className="text-right">
              Day
            </label>
            <Select
              value={newRule.weekDay.toString()}
              onValueChange={(value) => setNewRule({ ...newRule, weekDay: parseInt(value) })}
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
              value={newRule.startTime}
              onChange={(e) => setNewRule({ ...newRule, startTime: e.target.value })}
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
              value={newRule.endTime}
              onChange={(e) => setNewRule({ ...newRule, endTime: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="slotDuration" className="text-right">
              Slot Duration
            </label>
            <Select
              value={newRule.slotDuration.toString()}
              onValueChange={(value) => setNewRule({ ...newRule, slotDuration: parseInt(value) })}
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
          <Button onClick={handleCreateRule} disabled={createMentorRuleMutation.isPending}>
            {createMentorRuleMutation.isPending ? "Creating..." : "Create Rule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

