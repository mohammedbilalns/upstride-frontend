import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvailableSlots, cancelReservation } from "@/features/sessions/services/session.service";
import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
} from '@/components/ui/full-calendar';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookingSlots from "./BookingSlots";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/app/store/auth.store";
import { toast } from "sonner";
import BookingPaymentDialog from "./BookingPaymentDialog";
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

interface BookingCalendarProps {
    mentorId: string;
}

export default function BookingCalendar({ mentorId }: BookingCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [slotToCancel, setSlotToCancel] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: slots = [], isLoading } = useQuery({
        queryKey: ['available-slots', mentorId, viewDate.getMonth(), viewDate.getFullYear()],
        queryFn: () => getAvailableSlots(mentorId, viewDate.getMonth(), viewDate.getFullYear()),
        enabled: !!mentorId,
    });


    const eventsMap = new Map<string, any>();

    slots.forEach((slot: any) => {
        // Log processing

        const dateKey = new Date(slot.startAt).toDateString();

        if (!eventsMap.has(dateKey)) {
            eventsMap.set(dateKey, {
                id: dateKey,
                start: new Date(slot.startAt),
                end: new Date(slot.endAt),
                title: "",
                color: 'blue'
            });
        }
    });

    const events = Array.from(eventsMap.values());

    const cancelReservationMutation = useMutation({
        mutationFn: cancelReservation,
        onSuccess: () => {
            toast.success("Reservation cancelled");
            queryClient.invalidateQueries({ queryKey: ['available-slots'] });
            queryClient.invalidateQueries({ queryKey: ['slots'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to cancel reservation");
        }
    });

    const handleBook = (slotId: string) => {
        if (!user) {
            toast.error("Please login to book a session");
            navigate({ to: "/auth" });
            return;
        }

        const slot = slots.find((s: any) => s.id === slotId);

        if (slot) {
            setSelectedSlot(slot);
            setIsPaymentOpen(true);
        }
    };

    const handleCancelReservation = (slotId: string) => {
        setSlotToCancel(slotId);
    };

    const confirmCancelReservation = () => {
        if (slotToCancel) {
            cancelReservationMutation.mutate(slotToCancel);
            setSlotToCancel(null);
        }
    };

    return (
        <div className="h-[600px] flex flex-col">
            <Calendar
                view="month"
                onDayClick={setSelectedDate}
                onDateChange={setViewDate}
                events={events}
                hideEventTime={true}
            >
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    {/* Left: Calendar View */}
                    <div className="md:w-[60%] shrink-0">
                        <Card className="h-full flex flex-col shadow-sm border-border/60">
                            <CardHeader className="pb-2 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CalendarCurrentDate className="text-lg font-semibold" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CalendarPrevTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                            <ChevronLeft className="h-4 w-4" />
                                        </CalendarPrevTrigger>
                                        <CalendarNextTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                            <ChevronRight className="h-4 w-4" />
                                        </CalendarNextTrigger>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-4">
                                <CalendarMonthView />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Slots List */}
                    <div className="flex-1 min-w-0">
                        <BookingSlots
                            date={selectedDate}
                            slots={slots}
                            isLoading={isLoading}
                            onBook={handleBook}
                            onCancelReservation={handleCancelReservation}
                            currentUserId={user?.id}
                        />
                    </div>
                </div>
            </Calendar>

            <BookingPaymentDialog
                open={isPaymentOpen}
                onOpenChange={setIsPaymentOpen}
                slot={selectedSlot}
                mentorId={mentorId}
                onSuccess={() => { }}
            />

            <AlertDialog open={!!slotToCancel} onOpenChange={(open) => !open && setSlotToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Reservation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this reservation? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmCancelReservation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Yes, Cancel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
