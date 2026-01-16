import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, Loader2 } from "lucide-react";
import { getWalletBalance, payWithWallet } from "@/features/wallet/services/wallet.service";
import { createPayment, verifyPayment } from "@/features/payment/services/payment.service";
import { } from "@/features/sessions/services/session.service";
import { toast } from "sonner";
import { useRazorpay } from "@/shared/hooks/useRazorpay";
import type { Slot } from "@/shared/types/session";
import { format, parseISO } from "date-fns";

interface BookingPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slot: Slot | null;
    mentorId: string;
    onSuccess: () => void;
}

export default function BookingPaymentDialog({
    open,
    onOpenChange,
    slot,
    mentorId,
    onSuccess
}: BookingPaymentDialogProps) {
    const [selectedMethod, setSelectedMethod] = useState<"wallet" | "direct" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    useRazorpay();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (open) {
            setIsProcessing(false);
            setSelectedMethod(null);
        }
    }, [open]);




    // Fetch Wallet Balance
    const { data: walletBalance, isLoading: isBalanceLoading } = useQuery({
        queryKey: ['wallet-balance'],
        queryFn: () => getWalletBalance('USER'),
        enabled: open,
    });

    // Book Session Mutation
    const bookSessionMutation = useMutation({
        mutationFn: async (slotId: string) => {
            const { bookSession } = await import("@/features/sessions/services/session.service");
            return bookSession(slotId);
        }
    });


    if (!slot) return null;

    const isSufficientBalance = (walletBalance?.balance || 0) >= slot.price;
    const balance = walletBalance?.balance || 0;

    const handleConfirmPayment = async () => {
        if (!slot || !selectedMethod) return;
        setIsProcessing(true);

        try {
            // Create Booking 
            const booking = await bookSessionMutation.mutateAsync(slot.id);
            const bookingId = booking.bookingId;

            if (selectedMethod === 'wallet') {
                //  Pay with Wallet
                await payWithWallet({
                    bookingId: bookingId,
                    mentorId: mentorId,
                    amount: slot.price,
                    slotId: slot.id
                });

                toast.success("Booking confirmed successfully!");
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
                    queryClient.invalidateQueries({ queryKey: ['available-slots'] });
                    queryClient.invalidateQueries({ queryKey: ['slots'] });
                    onSuccess();
                    onOpenChange(false);
                }, 1000);
            } else {
                //  Pay with Direct (Razorpay)
                const order = await createPayment({
                    bookingId: bookingId,
                    amount: slot.price,
                    currency: "INR",
                    paymentType: "BOOKING",
                    mentorId: mentorId,
                    sessionId: slot.id,
                    userId: ""
                } as any);

                if (!window.Razorpay) {
                    throw new Error("Razorpay SDK not loaded");
                }

                const orderData = order.data || order;

                const options = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: "UpStride",
                    description: "Session Booking",
                    order_id: orderData.id,
                    handler: async (response: any) => {
                        try {
                            await verifyPayment({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature
                            });

                            toast.success("Payment successful! Booking confirmed.");
                            setTimeout(() => {
                                queryClient.invalidateQueries({ queryKey: ['available-slots'] });
                                queryClient.invalidateQueries({ queryKey: ['slots'] });
                                onSuccess();
                                onOpenChange(false);
                            }, 1000);
                        } catch (error) {
                            toast.error("Payment verification failed");
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            queryClient.invalidateQueries({ queryKey: ['available-slots'] });
                            queryClient.invalidateQueries({ queryKey: ['slots'] });
                            onOpenChange(false);
                        }
                    },
                    theme: {
                        color: "#0F172A",
                    },
                };

                const rzp = new window.Razorpay(options);
                onOpenChange(false);
                rzp.open();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Booking failed");
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!isProcessing) onOpenChange(v); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{slot.status === 'RESERVED' ? 'Complete Payment' : 'Confirm Booking'}</DialogTitle>
                    <DialogDescription>
                        {slot.status === 'RESERVED'
                            ? "This slot is reserved for you. Complete payment to confirm."
                            : `Choose a payment method to book your session on ${format(parseISO(slot.startAt), "MMM d, h:mm a")}.`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex justify-between items-center mb-6 p-4 bg-muted/50 rounded-lg">
                        <span className="font-medium">Total Amount</span>
                        <span className="text-xl font-bold">₹{slot.price}</span>
                    </div>

                    <div className="space-y-4">
                        {/* Wallet Option */}
                        <div
                            className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === 'wallet' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-primary/50'} ${!isSufficientBalance ? 'opacity-70 pointer-events-none' : ''}`}
                            onClick={() => isSufficientBalance && setSelectedMethod('wallet')}
                        >
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">My Wallet</p>
                                        <p className="text-sm text-muted-foreground">
                                            Balance: ₹{isBalanceLoading ? "..." : balance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                {!isSufficientBalance && !isBalanceLoading && (
                                    <Badge variant="destructive" className="text-xs">Insufficient</Badge>
                                )}
                                {selectedMethod === 'wallet' && (
                                    <div className="h-4 w-4 rounded-full bg-primary" />
                                )}
                            </div>
                        </div>

                        {/* Direct Pay Option */}
                        <div
                            className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedMethod === 'direct' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-primary/50'}`}
                            onClick={() => setSelectedMethod('direct')}
                        >
                            <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Direct Payment</p>
                                        <p className="text-sm text-muted-foreground">Via Razorpay</p>
                                    </div>
                                </div>
                                {selectedMethod === 'direct' && (
                                    <div className="h-4 w-4 rounded-full bg-primary" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
                    <Button
                        onClick={handleConfirmPayment}
                        disabled={!selectedMethod || isProcessing}
                    >
                        {isProcessing && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm & Pay
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
