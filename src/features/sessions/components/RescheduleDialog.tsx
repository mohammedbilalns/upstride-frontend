import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSlots } from "@/features/sessions/services/session.service";
import Loading from "@/components/common/Loading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    type CalendarEvent,
} from '@/components/ui/full-calendar';
import PublicDaySlotsDialog from "@/features/mentor-portal/components/PublicDaySlotsDialog";
import { isSameDay, parseISO } from "date-fns";
import type { Booking } from "@/shared/types/session";

interface RescheduleDialogProps {
    booking: Booking | null;
    open: boolean;
    onClose: () => void;
    onReschedule: (slotId: string, reason?: string) => void;
}

const RescheduleDialog = ({ booking, open, onClose, onReschedule }: RescheduleDialogProps) => {
    const mentorId = booking?.slot?.mentorId;

    const { data: slots, isLoading } = useQuery({
        queryKey: ["slots", mentorId, "available"],
        queryFn: () => mentorId ? getSlots(mentorId, undefined, undefined, true) : Promise.resolve([]),
        enabled: !!mentorId && open
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDayDialogOpen(true);
    };

    const selectedDateSlots = useMemo(() => {
        if (!slots || !selectedDate) return [];
        return slots.filter((slot) =>
            isSameDay(parseISO(slot.startAt), selectedDate)
        ).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }, [slots, selectedDate]);


    const events: CalendarEvent[] = (slots || []).map(slot => ({
        id: slot.id,
        start: new Date(slot.startAt),
        end: new Date(slot.endAt),
        title: `Available`,
        color: 'blue'
    }));

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[700px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Reschedule Session</DialogTitle>
                </DialogHeader>

                {isLoading ? <Loading /> : (
                    <div className="flex-1 overflow-hidden">
                        <Calendar
                            events={events}
                            onEventClick={(event) => {
                                setSelectedDate(event.start);
                                setIsDayDialogOpen(true);
                            }}
                            onDayClick={handleDayClick}
                            view="month"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center gap-2">
                                        <CalendarPrevTrigger>
                                            <ChevronLeft className="size-4" />
                                            <span className="sr-only">Previous</span>
                                        </CalendarPrevTrigger>
                                        <CalendarTodayTrigger>Today</CalendarTodayTrigger>
                                        <CalendarNextTrigger>
                                            <ChevronRight className="size-4" />
                                            <span className="sr-only">Next</span>
                                        </CalendarNextTrigger>
                                        <CalendarCurrentDate />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <CalendarMonthView />
                                </div>
                            </div>
                        </Calendar>
                    </div>
                )}

                <PublicDaySlotsDialog
                    date={selectedDate}
                    slots={selectedDateSlots}
                    isOpen={isDayDialogOpen}
                    onClose={() => setIsDayDialogOpen(false)}
                    onBookSlot={(slotId) => {
                        onReschedule(slotId);
                        setIsDayDialogOpen(false);
                    }}
                    processingSlotId={null}
                />
            </DialogContent>
        </Dialog>
    );
};

export default RescheduleDialog;
