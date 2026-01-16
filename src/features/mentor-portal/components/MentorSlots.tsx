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
    slots?: any[];
    isLoading?: boolean;
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MentorSlots({ mentorId, date, slots: propsSlots, isLoading: propsIsLoading }: MentorSlotsProps) {
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
    const displayDate = date || new Date();

    const { data: fetchedSlots, isLoading: isQueryLoading, error } = useQuery({
        queryKey: ['slots', mentorId],
        queryFn: () => getSlots(mentorId),
        enabled: !propsSlots && !!mentorId, // Only fetch if slots passed as props are null/undefined
    });

    const slots = propsSlots || fetchedSlots;
    const isLoading = propsIsLoading || isQueryLoading;

    const deleteSlotMutation = useDeleteSlot();

    // Filter slots for the selected date
    const selectedDateSlots = useMemo(() => {
        if (!slots) return [];
        return slots.filter((slot: any) =>
            isSameDay(parseISO(slot.startAt), displayDate)
        ).sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }, [slots, displayDate]);

    const handleDeleteClick = (slotId: string) => {
        setSlotToDelete(slotId);
    };

    const confirmDelete = () => {
        if (slotToDelete) {
            deleteSlotMutation.mutate(slotToDelete);
            setSlotToDelete(null);
        }
    };

    if (isLoading) return <Pending resource="Active Slots" />;

    if (error) {
        // @ts-expect-error - axios error typing
        if (error.response?.status === 404) {
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
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            {format(displayDate, "EEEE, MMM d")}
                        </CardTitle>
                        <CardDescription>
                            {selectedDateSlots.length} slots available
                        </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setIsAddSlotOpen(true)} className="shrink-0">
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
                                            <Badge
                                                variant={slot.status === 'OPEN' ? 'outline' : slot.status === 'RESERVED' ? 'secondary' : 'default'}
                                                className={slot.status === 'OPEN' ? '' : slot.status === 'RESERVED' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-primary/10 text-primary'}
                                            >
                                                {slot.status === 'OPEN' ? 'Open' : slot.status === 'RESERVED' ? 'Reserved' : 'Booked'}
                                            </Badge>
                                            {typeof slot.price === 'number' && slot.price > 0 && (
                                                <span className="text-xs text-muted-foreground self-center ml-1">
                                                    ₹{slot.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {slot.status === 'OPEN' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteClick(slot.id)}
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

                <AlertDialog open={!!slotToDelete} onOpenChange={(open) => !open && setSlotToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this time slot.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
