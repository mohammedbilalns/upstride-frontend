import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSlots, bookSession } from "@/features/sessions/services/session.service";
import { createPayment } from "@/features/payment/services/payment.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Loading from "@/components/common/Loading";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Slot } from "@/shared/types/session";


interface MentorSlotsProps {
    mentorId: string;
}

const MentorSlots = ({ mentorId }: MentorSlotsProps) => {
    const { data: slots, isLoading } = useQuery({
        queryKey: ["slots", mentorId],
        queryFn: () => getSlots(mentorId)
    });

    const [processingSlotId, setProcessingSlotId] = useState<string | null>(null);

    const bookingMutation = useMutation({
        mutationFn: bookSession,
        onSuccess: async (data, slotId) => {
            try {
                const slot = slots?.find(s => s.id === slotId);
                if (!slot) throw new Error("Slot info missing");

                const paymentRes = await createPayment({
                    bookingId: data.bookingId,
                    amount: slot.price,
                    currency: slot.currency || "USD" // Fallback
                });

                // paymentRes = { approvalUrl, orderId } (Assuming PayPal)
                // Redirect user
                if (paymentRes.approvalUrl) {
                    window.location.href = paymentRes.approvalUrl;
                } else {
                    toast.error("Failed to get payment link");
                }

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

    const handleBook = (slot: Slot) => {
        setProcessingSlotId(slot.id);
        bookingMutation.mutate(slot.id);
    };

    if (isLoading) return <Loading />;

    if (!slots || slots.length === 0) {
        return (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6" />
                        Available Sessions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No available slots at the moment.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6" />
                    Available Sessions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {slots.map((slot) => (
                        <div key={slot.id} className="border p-4 rounded-lg flex flex-col gap-2">
                            <div className="font-semibold text-lg">
                                {new Date(slot.startAt).toLocaleDateString()}
                            </div>
                            <div className="text-muted-foreground text-sm">
                                {new Date(slot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                {new Date(slot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="font-bold text-primary">
                                {slot.currency || '$'} {slot.price}
                            </div>
                            <Button
                                onClick={() => handleBook(slot)}
                                disabled={processingSlotId === slot.id}
                                className="mt-2"
                            >
                                {processingSlotId === slot.id ? "Processing..." : "Book Session"}
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default MentorSlots;
