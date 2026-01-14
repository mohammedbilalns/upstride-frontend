import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateCustomSlot } from "../hooks/mentor-dashboard-mutations.hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { format, isToday } from "date-fns";
import { getPricingConfig } from "@/features/pricing/services/pricing.service";
import { useAuthStore } from "@/app/store/auth.store";

const customSlotSchema = z.object({
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    slotDuration: z.number(),
});

type CustomSlotFormValues = z.infer<typeof customSlotSchema>;

interface AddCustomSlotDialogProps {
    mentorId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate?: Date;
}

export default function AddCustomSlotDialog({
    mentorId,
    open,
    onOpenChange,
    selectedDate,
}: AddCustomSlotDialogProps) {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Check if pricing is configured
    const { data: pricingConfig, isLoading: loadingPricing } = useQuery({
        queryKey: ["pricing-config", user?.id],
        queryFn: () => getPricingConfig(user?.id || ""),
        enabled: open && !!user?.id,
    });

    const form = useForm<CustomSlotFormValues>({
        resolver: zodResolver(customSlotSchema),
        defaultValues: {
            date: selectedDate
                ? format(selectedDate, "yyyy-MM-dd")
                : format(new Date(), "yyyy-MM-dd"),
            startTime: "09:00",
            endTime: "10:00",
            slotDuration: 60,
        },
    });

    useEffect(() => {
        if (open && selectedDate) {
            form.setValue("date", format(selectedDate, "yyyy-MM-dd"));
        }
    }, [open, selectedDate, form]);

    // Redirect to pricing if not configured
    useEffect(() => {
        if (open && !loadingPricing && !pricingConfig) {
            onOpenChange(false);
            navigate({ to: "/settings/pricing" });
        }
    }, [open, loadingPricing, pricingConfig, onOpenChange, navigate]);

    const createCustomSlotMutation = useCreateCustomSlot(mentorId);

    // Watch fields
    const startTime = form.watch("startTime");
    const slotDuration = form.watch("slotDuration");

    useEffect(() => {
        if (startTime && slotDuration) {
            const [hours, minutes] = startTime.split(":").map(Number);
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes + Number(slotDuration));

            const newEndHours = String(date.getHours()).padStart(2, "0");
            const newEndMinutes = String(date.getMinutes()).padStart(2, "0");
            const newEndTime = `${newEndHours}:${newEndMinutes}`;

            form.setValue("endTime", newEndTime);
        }
    }, [startTime, slotDuration, form]);

    const onSubmit = (data: CustomSlotFormValues) => {
        const startAtDate = new Date(`${data.date}T${data.startTime}`);
        let endAtDate = new Date(`${data.date}T${data.endTime}`);

        if (startAtDate < new Date()) {
            form.setError("startTime", { message: "Cannot create slot in the past" });
            return;
        }

        if (endAtDate <= startAtDate) {
            endAtDate.setDate(endAtDate.getDate() + 1);
        }

        createCustomSlotMutation.mutate(
            {
                mentorId,
                startAt: startAtDate.toISOString(),
                endAt: endAtDate.toISOString(),
                slotDuration: data.slotDuration,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
            },
        );
    };

    const minTime =
        selectedDate && isToday(selectedDate)
            ? format(new Date(), "HH:mm")
            : undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Custom Slot</DialogTitle>
                    <DialogDescription>
                        Create a one-time session slot for{" "}
                        {selectedDate ? format(selectedDate, "PPP") : "a specific date"}.
                    </DialogDescription>
                </DialogHeader>

                {!pricingConfig && !loadingPricing && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please configure your pricing tiers before creating custom slots.
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-4"
                    >
                        {/* Date */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right text-sm font-medium">Date</span>
                            <div className="col-span-3 text-sm font-semibold">
                                {selectedDate ? format(selectedDate, "PPP") : "No date selected"}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input type="hidden" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Duration */}
                        <FormField
                            control={form.control}
                            name="slotDuration"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Duration</FormLabel>
                                    <Select
                                        onValueChange={(v) => field.onChange(Number(v))}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="60">1 hour</SelectItem>
                                            <SelectItem value="90">1.5 hours</SelectItem>
                                            <SelectItem value="120">2 hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="col-span-4 text-right" />
                                </FormItem>
                            )}
                        />

                        {/* Start Time */}
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Start Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            className="col-span-3"
                                            min={minTime}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-span-4 text-right" />
                                </FormItem>
                            )}
                        />

                        {/* End Time (Read Only) */}
                        <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">End Time</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            className="col-span-3 bg-muted"
                                            readOnly
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="col-span-4 text-right" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createCustomSlotMutation.isPending || !pricingConfig}
                            >
                                {createCustomSlotMutation.isPending
                                    ? "Creating..."
                                    : "Create Slot"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
