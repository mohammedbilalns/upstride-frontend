import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSlots, bookSession } from "@/features/sessions/services/session.service";
import { createPayment, verifyPayment } from "@/features/payment/services/payment.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import Loading from "@/components/common/Loading";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    type CalendarEvent,
} from '@/components/ui/full-calendar';

import { useAuthStore } from "@/app/store/auth.store";
import PublicDaySlotsDialog from "./PublicDaySlotsDialog";
import { isSameDay, parseISO } from "date-fns";

interface MentorSlotsProps {
    mentorId: string;
}

const MentorSlots = ({ mentorId }: MentorSlotsProps) => {
    // Pass availableOnly=true to fetch only non-booked slots
    const { data: slots, isLoading } = useQuery({
        queryKey: ["slots", mentorId, "available"],
        queryFn: () => getSlots(mentorId, undefined, true)
    });

    const [processingSlotId, setProcessingSlotId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { user } = useAuthStore();
    const { Razorpay } = useRazorpay();
    const queryClient = useQueryClient();

    const bookingMutation = useMutation({
        mutationFn: bookSession,
        onSuccess: async (data, slotId) => {
            try {
                if (!user) {
                    toast.error("You must be logged in to book a session");
                    setProcessingSlotId(null);
                    return;
                }
                const slot = slots?.find(s => s.id === slotId);
                if (!slot) throw new Error("Slot info missing");

                console.log('[MentorSlots] bookSession response:', data);
                console.log('[MentorSlots] Creating payment with bookingId:', data.bookingId);

                const order = await createPayment({
                    bookingId: data.bookingId,
                    amount: slot.price,
                    currency: "INR",
                    mentorId: mentorId,
                    userId: user.id
                });

                const options = {
                    key: order.keyId,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Upstride Mentorship",
                    description: "Mentorship Session Booking",
                    order_id: order.id,
                    handler: async (response: any) => {
                        try {
                            await verifyPayment({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            });
                            toast.success("Payment Successful!");

                            // Invalidate slots cache to refresh UI
                            await queryClient.invalidateQueries({
                                queryKey: ["slots", mentorId]
                            });

                            setProcessingSlotId(null);
                        } catch (err) {
                            toast.error("Payment Verification Failed");
                            setProcessingSlotId(null);
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone || ""
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: () => {
                            toast.error("Payment Cancelled");
                            setProcessingSlotId(null);
                        }
                    }
                };

                const rzp1 = new Razorpay(options);
                rzp1.open();

            } catch (error) {
                toast.error("Payment initiation failed");
                setProcessingSlotId(null);
            }
        },
        onError: () => {
            toast.error("Booking failed");
            setProcessingSlotId(null);
        }
    });

    const handleBook = (slotId: string) => {
        if (processingSlotId) return;
        setProcessingSlotId(slotId);
        bookingMutation.mutate(slotId);
    };

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
    };

    const selectedDateSlots = useMemo(() => {
        if (!slots || !selectedDate) return [];
        return slots.filter((slot) =>
            isSameDay(parseISO(slot.startAt), selectedDate)
        ).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    }, [slots, selectedDate]);


    if (isLoading) return <Loading />;

    const events: CalendarEvent[] = (slots || []).map(slot => ({
        id: slot.id,
        start: new Date(slot.startAt),
        end: new Date(slot.endAt),
        title: processingSlotId === slot.id ? "Processing..." : `₹${slot.price}`,
        color: processingSlotId === slot.id ? 'default' : 'blue'
    }));

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <CalendarIcon className="h-6 w-6" />
                    Available Sessions
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[600px] p-0 overflow-hidden">
                <Calendar
                    events={events}
                    onEventClick={(event) => {
                        setSelectedDate(event.start);
                        setIsDialogOpen(true);
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
            </CardContent>

            <PublicDaySlotsDialog
                date={selectedDate}
                slots={selectedDateSlots}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onBookSlot={handleBook}
                processingSlotId={processingSlotId}
            />
        </Card>
    );
};

export default MentorSlots;
