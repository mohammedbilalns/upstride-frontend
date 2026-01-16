
import { format, isSameDay } from "date-fns";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingSlotsProps {
    date: Date;
    slots: any[];
    isLoading: boolean;
    onBook: (slotId: string) => void;
    onCancelReservation?: (slotId: string) => void;
    currentUserId?: string;
}

export default function BookingSlots({ date, slots, isLoading, onBook, onCancelReservation, currentUserId }: BookingSlotsProps) {
    const dailySlots = slots.filter((slot: any) =>
        isSameDay(new Date(slot.startAt), date) &&
        (slot.status === 'OPEN' || ((slot.status === 'RESERVED' || slot.status === 'FULL') && currentUserId && slot.participantId === currentUserId))
    ).sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    return (
        <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-card shadow-sm border-border/60">
            <div className="p-4 border-b bg-card/50">
                <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Available Slots
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    {format(date, "EEEE, MMMM d, yyyy")}
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Loading slots...
                        </div>
                    ) : dailySlots.length > 0 ? (
                        <div className="grid gap-3">
                            {dailySlots.map((slot: any) => (
                                <div
                                    key={slot.id}
                                    className="flex flex-wrap items-center justify-between p-3 gap-2 rounded-lg border bg-card hover:border-primary/50 hover:bg-muted/50 transition-all group"
                                >
                                    <div className="flex flex-col gap-1 min-w-[120px]">
                                        <span className="font-semibold text-base">
                                            {format(new Date(slot.startAt), "h:mm a")}
                                        </span>
                                        {slot.status === 'RESERVED' && (
                                            <span className="text-[10px] font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded w-fit">
                                                Reserved
                                            </span>
                                        )}
                                        {slot.status === 'FULL' && (
                                            <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded w-fit">
                                                Booked
                                            </span>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(slot.endAt), "h:mm a")} • {slot.duration} mins
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {slot.status === 'RESERVED' && onCancelReservation && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => onCancelReservation(slot.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        {slot.status !== 'FULL' && (
                                            <Button
                                                size="sm"
                                                onClick={() => onBook(slot.id)}
                                                className="transition-opacity"
                                            >
                                                {slot.status === 'RESERVED' ? 'Pay Now' : 'Book'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Calendar className="h-8 w-8 mb-3 opacity-20" />
                            <p>No available slots for this date.</p>
                            <p className="text-xs mt-1">Try selecting another date</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
