import { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAddRecurringRule } from "../hooks/mentor-dashboard-mutations.hooks";

interface RuleFormValues {
  weekDay: number;
  startTime: string;
  endTime: string;
  slotDuration: 60 | 90 | 120 | 180;
}

export default function AddRuleDialog({ mentorId }: { mentorId: string }) {
  const [open, setOpen] = useState(false);
  const createMentorRuleMutation = useAddRecurringRule(mentorId);


  const form = useForm<RuleFormValues>({
    defaultValues: {
      weekDay: 1,
      startTime: "09:00",
      endTime: "10:00",
      slotDuration: 60,
    },
  });

  // Watch values to auto-calculate end time
  const startTime = form.watch("startTime");
  const slotDuration = form.watch("slotDuration");

  // Calculate and set end time whenever start time or duration changes
  useEffect(() => {
    if (startTime && slotDuration) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes + Number(slotDuration));

      const newEndHours = String(date.getHours()).padStart(2, "0");
      const newEndMinutes = String(date.getMinutes()).padStart(2, "0");
      const newEndTime = `${newEndHours}:${newEndMinutes}`;

      if (form.getValues("endTime") !== newEndTime) {
        form.setValue("endTime", newEndTime);
      }
    }
  }, [startTime, slotDuration, form]);

  const onSubmit = (values: RuleFormValues) => {
    createMentorRuleMutation.mutate(
      { rule: values },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      },
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        <FormProvider {...form}>
          <form className="grid gap-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Weekday */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Day</label>
              <Controller
                name="weekDay"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Start Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Start Time</label>
              <Input
                type="time"
                className="col-span-3"
                {...form.register("startTime")}
              />
            </div>

            {/* End Time */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">End Time</label>
              <Input
                type="time"
                className="col-span-3"
                {...form.register("endTime")}
                readOnly
              />
            </div>

            {/* Slot Duration */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Slot Duration</label>
              <Controller
                name="slotDuration"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
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
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMentorRuleMutation.isPending}>
                {createMentorRuleMutation.isPending
                  ? "Creating..."
                  : "Create Rule"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
