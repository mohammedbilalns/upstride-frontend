import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSlots } from "@/features/sessions/services/session.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutList, Trash2, Plus, Clock } from "lucide-react";
import Pending from "@/components/common/Pending";
import ErrorState from "@/components/common/ErrorState";
import { useDeleteSlot } from "../hooks/mentor-dashboard-mutations.hooks";
import { isSameDay, parseISO, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddCustomSlotDialog from "./AddCustomSlotDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MentorSlotsProps {
    mentorId: string;
    date?: Date;
}

export default function MentorSlots({ mentorId, date }: MentorSlotsProps) {
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const displayDate = date || new Date();

    const { data: slots, isLoading, error } = useQuery({
        queryKey: ['slots', mentorId],
        queryFn: () => getSlots(mentorId),
        enabled: !!mentorId,
    });

    const deleteSlotMutation = useDeleteSlot(mentorId);

    // Filter slots for the selected date
    const selectedDateSlots = useMemo(() => {
        if (!slots) return [];
        return slots.filter((slot: any) =>
            isSameDay(parseISO(slot.startAt), displayDate)
        ).sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }, [slots, displayDate]);

    if (isLoading) return <Pending resource="Active Slots" />;

    if (error) {
        // @ts-expect-error - axios error typing
        if (error.response?.status === 404) {
            // Treat 404 as no slots found yet, which is fine
            return <SlotsListEmptyState
                date={displayDate}
                onAdd={() => setIsAddSlotOpen(true)}
            />;
        }
        return <ErrorState message="Failed to load slots." onRetry={() => window.location.reload()} />;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            {format(displayDate, "EEEE, MMM d")}
                        </CardTitle>
                        <CardDescription>
                            {selectedDateSlots.length} slots available
                        </CardDescription>
                    </div>
                    {/* Add Button in Header as requested */}
                    <Button size="sm" onClick={() => setIsAddSlotOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Slot
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full px-6 pb-6">
                    {selectedDateSlots.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No slots scheduled for this day.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-2">
                            {selectedDateSlots.map((slot: any) => (
                                <div
                                    key={slot.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-lg">
                                                {format(parseISO(slot.startAt), "h:mm a")}
                                            </span>
                                            <span className="text-muted-foreground text-sm">
                                                - {format(parseISO(slot.endAt), "h:mm a")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={slot.isBooked ? "secondary" : "outline"} className={slot.isBooked ? "bg-primary/10 text-primary" : ""}>
                                                {slot.isBooked ? "Booked" : "Open"}
                                            </Badge>
                                            {slot.price > 0 && (
                                                <span className="text-xs text-muted-foreground">
                                                    ₹{slot.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!slot.isBooked && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => deleteSlotMutation.mutate(slot.id)}
                                            disabled={deleteSlotMutation.isPending}
                                            title="Disable/Delete Slot"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <AddCustomSlotDialog
                    mentorId={mentorId}
                    open={isAddSlotOpen}
                    onOpenChange={setIsAddSlotOpen}
                    selectedDate={displayDate}
                />
            </CardContent>
        </Card>
    );
}

function SlotsListEmptyState({ date, onAdd }: { date: Date, onAdd: () => void }) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {format(date, "EEEE, MMM d")}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <LayoutList className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No slots scheduled</h3>
                <p className="text-muted-foreground text-sm mb-4">
                    You haven't added any availability for this date.
                </p>
                <Button onClick={onAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Slot
                </Button>
            </CardContent>
        </Card>
    )
}
