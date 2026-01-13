import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSessions, requestReschedule, handleReschedule } from '../services/session.service';
import { useAuthStore } from '@/app/store/auth.store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionItem from '../components/SessionItem';
import RescheduleDialog from '../components/RescheduleDialog';
import SessionDetailsDialog from '../components/SessionDetailsDialog';
import Loading from '@/components/common/Loading';
import { toast } from 'sonner';
import type { Booking } from '@/shared/types/session';

const SessionsPage = () => {
    const { user } = useAuthStore();
    const isMentor = user?.role === 'mentor';
    const queryClient = useQueryClient();
    const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);
    const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);

    // Mutations
    const requestRescheduleMutation = useMutation({
        mutationFn: ({ bookingId, slotId, reason }: { bookingId: string, slotId: string, reason?: string }) =>
            requestReschedule({ bookingId, requestedSlotId: slotId, reason }),
        onSuccess: () => {
            toast.success("Reschedule request submitted successfully.");
            setRescheduleBooking(null);
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "We encountered an issue submitting the reschedule request. Please try again.");
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

    const onRescheduleClick = (booking: Booking) => {
        setRescheduleBooking(booking);
    };

    const onHandleReschedule = (bookingId: string, action: 'APPROVED' | 'REJECTED') => {
        handleRescheduleMutation.mutate({ bookingId, action });
    };

    const onViewDetails = (booking: Booking) => {
        setDetailsBooking(booking);
    };

    // Unified Queries (Backend handles role-based fetching)
    const { data: upcomingSessions, isLoading: isLoadingUpcoming } = useQuery({
        queryKey: ['sessions', 'upcoming', user?.role],
        queryFn: () => getSessions('upcoming'),
        enabled: !!user
    });

    const { data: historySessions, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['sessions', 'history', user?.role],
        queryFn: () => getSessions('history'),
        enabled: !!user
    });

    if (isLoadingUpcoming || isLoadingHistory) return <Loading />;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {upcomingSessions?.length === 0 ? (
                            <p className="text-gray-500">No upcoming sessions.</p>
                        ) : (
                            upcomingSessions?.map(session => (
                                <SessionItem
                                    key={session.id}
                                    session={session}
                                    isMentor={isMentor}
                                    onRescheduleClick={onRescheduleClick}
                                    onHandleReschedule={onHandleReschedule}
                                    onViewDetails={onViewDetails}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {historySessions?.length === 0 ? (
                            <p className="text-gray-500">No past sessions.</p>
                        ) : (
                            historySessions?.map(session => (
                                <SessionItem
                                    key={session.id}
                                    session={session}
                                    isMentor={isMentor}
                                    onRescheduleClick={onRescheduleClick}
                                    onHandleReschedule={onHandleReschedule}
                                    onViewDetails={onViewDetails}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <RescheduleDialog
                open={!!rescheduleBooking}
                booking={rescheduleBooking}
                onClose={() => setRescheduleBooking(null)}
                onReschedule={(slotId, reason) => {
                    if (rescheduleBooking) {
                        requestRescheduleMutation.mutate({ bookingId: rescheduleBooking.id, slotId, reason });
                    }
                }}
            />

            <SessionDetailsDialog
                open={!!detailsBooking}
                booking={detailsBooking}
                onClose={() => setDetailsBooking(null)}
                isMentor={isMentor}
                onRescheduleClick={(booking) => {
                    setDetailsBooking(null);
                    onRescheduleClick(booking);
                }}
                onHandleReschedule={(bookingId, action) => {
                    onHandleReschedule(bookingId, action);
                }}
            />
        </div>
    );
};

export default SessionsPage;
