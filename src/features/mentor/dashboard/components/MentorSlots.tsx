import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSlots } from "@/features/sessions/services/session.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutList, ChevronLeft, ChevronRight } from "lucide-react";
import Pending from "@/components/common/Pending";
import NotFoundComponent from "@/components/NotFoundComponent";
import ErrorState from "@/components/common/ErrorState";
import AddCustomSlotDialog from "./AddCustomSlotDialog";
import { useDeleteSlot } from "../hooks/mentor-dashboard-mutations.hooks";
import { isSameDay, parseISO, format, addMonths, startOfMonth, isSameMonth } from "date-fns";
import DaySlotsDialog from "./DaySlotsDialog";
import {
    Calendar,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    useCalendar,
} from '@/components/ui/full-calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const CalendarNavigation = () => {
    const { date, setDate } = useCalendar();
    const today = startOfMonth(new Date());
    const options = [0, 1, 2].map(i => addMonths(today, i));
    const maxDate = options[options.length - 1];

    const handleMonthChange = (value: string) => {
        setDate(new Date(value));
    };

    return (
        <div className="flex items-center gap-2 ml-auto">
            <CalendarPrevTrigger disabled={isSameMonth(date, today)}>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
            </CalendarPrevTrigger>

            <Select
                value={options.find(d => isSameMonth(d, date))?.toISOString() || date.toISOString()}
                onValueChange={handleMonthChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue>
                        {format(date, "MMMM yyyy")}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((optionDate) => (
                        <SelectItem key={optionDate.toISOString()} value={optionDate.toISOString()}>
                            {format(optionDate, "MMMM yyyy")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <CalendarNextTrigger disabled={isSameMonth(date, maxDate)}>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
            </CalendarNextTrigger>
        </div>
    );
};

interface MentorSlotsProps {
    mentorId: string;
}

export default function MentorSlots({ mentorId }: MentorSlotsProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
    const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);

    const { data: slots, isLoading, error } = useQuery({
        queryKey: ['slots', mentorId],
        queryFn: () => getSlots(mentorId),
        enabled: !!mentorId,
    });

    const deleteSlotMutation = useDeleteSlot(mentorId);

    const handleDeleteSlot = (slotId: string) => {
        deleteSlotMutation.mutate(slotId);
    };

    const events = useMemo(() => {
        if (!slots) return [];
        return slots.map((slot: any) => ({
            id: slot.id,
            start: new Date(slot.startAt),
            end: new Date(slot.endAt),
            title: `${format(new Date(slot.startAt), 'HH:mm')} (${slot.price} ${slot.currency || '$'})`,
            color: (slot.status === 'OPEN' ? 'blue' : 'pink') as "blue" | "pink",
        }));
    }, [slots]);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDayDialogOpen(true);
    };

    const handleEventClick = (event: any) => {
        // Open dialog for the event's start day
        setSelectedDate(event.start);
        setIsDayDialogOpen(true);
    };

    // Filter slots for the selected date (for dialog)
    const selectedDateSlots = useMemo(() => {
        if (!slots || !selectedDate) return [];
        return slots.filter((slot: any) =>
            isSameDay(parseISO(slot.startAt), selectedDate)
        ).sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }, [slots, selectedDate]);

    if (isLoading) return <Pending resource="Active Slots" />;

    if (error) {
        // @ts-expect-error - axios error typing
        if (error.response?.status === 404) {
            return <NotFoundComponent />;
        }
        return <ErrorState message="Failed to load slots. Please try again later." onRetry={() => window.location.reload()} />;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-none">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutList className="h-5 w-5" />
                            Manage Slot
                        </CardTitle>
                        <CardDescription>
                            Select a date on the calendar to view or manage slots.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <Calendar
                    events={events}
                    onDayClick={handleDayClick}
                    onEventClick={handleEventClick}
                >
                    <div className="h-full flex flex-col">
                        <div className="flex px-6 items-center gap-2 mb-6 border-b pb-4 pt-4">
                            <CalendarNavigation />
                        </div>

                        <div className="flex-1 px-6 overflow-hidden pb-4">
                            <CalendarMonthView />
                        </div>
                    </div>
                </Calendar>
            </CardContent>

            <DaySlotsDialog
                date={selectedDate}
                slots={selectedDateSlots}
                isOpen={isDayDialogOpen}
                onClose={() => setIsDayDialogOpen(false)}
                onDeleteSlot={handleDeleteSlot}
                onAddSlot={() => {
                    setIsAddSlotOpen(true);
                }}
            />

            <AddCustomSlotDialog
                mentorId={mentorId}
                open={isAddSlotOpen}
                onOpenChange={(open) => {
                    setIsAddSlotOpen(open);
                }}
                selectedDate={selectedDate}
            />
        </Card>
    );
}
