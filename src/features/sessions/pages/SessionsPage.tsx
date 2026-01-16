import { useState } from 'react';
import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { handleReschedule, getSessionsList } from '../services/session.service';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/app/store/auth.store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionItem from '../components/SessionItem';
import SessionDetailsDialog from '../components/SessionDetailsDialog';
import { toast } from 'sonner';
import type { Booking, Slot } from '@/shared/types/session';
import BookingPaymentDialog from '@/features/mentor-discovery/components/BookingPaymentDialog';
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
import { cancelBooking } from '../services/session.service';

const SessionsPage = () => {
    const { user } = useAuthStore();
    const isMentor = user?.role === 'mentor';
    const queryClient = useQueryClient();
    const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
    const [paymentSlot, setPaymentSlot] = useState<Slot | null>(null);
    const [paymentMentorId, setPaymentMentorId] = useState<string>("");
    const [cancelBookingItem, setCancelBookingItem] = useState<Booking | null>(null);

    // Mutations
    const cancelBookingMutation = useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            toast.success("Session cancelled successfully.");
            setCancelBookingItem(null);
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to cancel session.");
        }
    });



    const handleRescheduleMutation = useMutation({
        mutationFn: ({ bookingId, action }: { bookingId: string, action: 'APPROVED' | 'REJECTED' }) =>
            handleReschedule({ bookingId, action }),
        onSuccess: () => {
            toast.success("Reschedule request has been processed.");
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "We encountered an issue processing the reschedule request. Please try again.");
        }
    });

    const onHandleReschedule = (bookingId: string, action: 'APPROVED' | 'REJECTED') => {
        handleRescheduleMutation.mutate({ bookingId, action });
    };

    const onViewDetails = (booking: Booking) => {
        setDetailsBooking(booking);
    };

    const {
        data: upcomingData,
        fetchNextPage: fetchNextUpcoming,
        hasNextPage: hasNextUpcoming,
        isFetchingNextPage: isFetchingNextUpcoming,
        isLoading: isLoadingUpcoming
    } = useInfiniteQuery({
        queryKey: ['sessions', 'upcoming-list'],
        queryFn: ({ pageParam }) => getSessionsList({ pageParam, type: 'upcoming' }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.flatMap(p => p.sessions).length;
            if (loaded < lastPage.total) return allPages.length + 1;
            return undefined;
        }
    });

    const {
        data: historyData,
        fetchNextPage: fetchNextHistory,
        hasNextPage: hasNextHistory,
        isFetchingNextPage: isFetchingNextHistory,
        isLoading: isLoadingHistory
    } = useInfiniteQuery({
        queryKey: ['sessions', 'history-list'],
        queryFn: ({ pageParam }) => getSessionsList({ pageParam, type: 'history' }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.flatMap(p => p.sessions).length;
            if (loaded < lastPage.total) return allPages.length + 1;
            return undefined;
        }
    });

    const upcomingSessions = upcomingData?.pages.flatMap(p => p.sessions) || [];
    const historySessions = historyData?.pages.flatMap(p => p.sessions) || [];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    {/* <TabsTrigger value="history">History</TabsTrigger> */}
                </TabsList>

                <TabsContent value="upcoming">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoadingUpcoming ? (
                            <p>Loading...</p>
                        ) : upcomingSessions.length === 0 ? (
                            <p className="text-gray-500">No upcoming sessions.</p>
                        ) : (
                            upcomingSessions.map(session => (
                                <SessionItem
                                    key={session.id}
                                    session={session}
                                    isMentor={isMentor}

                                    onHandleReschedule={onHandleReschedule}
                                    onViewDetails={onViewDetails}
                                    onCancelClick={(booking) => setCancelBookingItem(booking)}
                                    onPayClick={(booking) => {
                                        if (booking.slot) {
                                            setPaymentSlot(booking.slot);
                                            setPaymentMentorId(booking.mentorDetails?.id || "");
                                        }
                                    }}
                                />
                            ))
                        )}
                    </div>
                    {hasNextUpcoming && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={() => fetchNextUpcoming()}
                                disabled={isFetchingNextUpcoming}
                                variant="outline"
                            >
                                {isFetchingNextUpcoming ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </TabsContent>

                {/* <TabsContent value="history">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {isLoadingHistory ? (
                            <p>Loading...</p>
                        ) : historySessions.length === 0 ? (
                            <p className="text-gray-500">No past sessions.</p>
                        ) : (
                            historySessions.map(session => (
                                <SessionItem
                                    key={session.id}
                                    session={session}
                                    isMentor={isMentor}

                                    onHandleReschedule={onHandleReschedule}
                                    onViewDetails={onViewDetails}
                                    onCancelClick={(booking) => setCancelBookingItem(booking)}
                                    onPayClick={(booking) => {
                                        if (booking.slot) {
                                            setPaymentSlot(booking.slot);
                                            setPaymentMentorId(booking.mentorDetails?.id || "");
                                        }
                                    }}
                                />
                            ))
                        )}
                    </div>
                    {hasNextHistory && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                onClick={() => fetchNextHistory()}
                                disabled={isFetchingNextHistory}
                                variant="outline"
                            >
                                {isFetchingNextHistory ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </TabsContent> */}
            </Tabs>



            <SessionDetailsDialog
                open={!!detailsBooking}
                booking={detailsBooking}
                onClose={() => setDetailsBooking(null)}
                isMentor={isMentor}

                onHandleReschedule={(bookingId, action) => {
                    onHandleReschedule(bookingId, action);
                }}
            />

            <BookingPaymentDialog
                open={!!paymentSlot}
                onOpenChange={(open) => !open && setPaymentSlot(null)}
                slot={paymentSlot}
                mentorId={paymentMentorId}
                onSuccess={() => {
                    setPaymentSlot(null);
                    queryClient.invalidateQueries({ queryKey: ['sessions'] });
                }}
            />

            <AlertDialog open={!!cancelBookingItem} onOpenChange={(open) => !open && setCancelBookingItem(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this session? This action cannot be undone.
                            {cancelBookingItem && cancelBookingItem.slot && cancelBookingItem.paymentDetails && (
                                <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                                    <p className="font-semibold mb-1">Refund Estimate:</p>
                                    {(() => {
                                        const now = new Date();
                                        const sessionStart = new Date(cancelBookingItem.slot.startAt);
                                        const hoursUntilSession = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);
                                        const totalAmount = cancelBookingItem.paymentDetails.amount;
                                        let userPercentage = 0;

                                        if (hoursUntilSession < 24) {
                                            userPercentage = 0.5;
                                        } else if (hoursUntilSession < 72) {
                                            userPercentage = 0.7;
                                        } else {
                                            userPercentage = 0.8;
                                        }

                                        const refundAmount = totalAmount * userPercentage;
                                        return (
                                            <>
                                                <p>Time until session: {Math.max(0, Math.floor(hoursUntilSession))} hours</p>
                                                <p>Refund Policy: {userPercentage * 100}% refund</p>
                                                <p className="font-bold text-green-600 mt-1">
                                                    Estimated Refund: {cancelBookingItem.paymentDetails.currency} {refundAmount.toFixed(2)}
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Session</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => cancelBookingItem && cancelBookingMutation.mutate(cancelBookingItem.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, Cancel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SessionsPage;
