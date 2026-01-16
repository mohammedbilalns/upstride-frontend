import type { Booking } from '@/shared/types/session';
import { API_ROUTES } from '@/shared/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, subMinutes } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import UserAvatar from '@/components/common/UserAvatar';

interface SessionItemProps {
    session: Booking;
    isMentor: boolean;

    onHandleReschedule: (bookingId: string, action: 'APPROVED' | 'REJECTED') => void;
    onViewDetails: (booking: Booking) => void;
    onCancelClick?: (booking: Booking) => void;
    onPayClick?: (booking: Booking) => void;
}

const SessionItem = ({ session, isMentor, onHandleReschedule, onViewDetails, onCancelClick, onPayClick }: SessionItemProps) => {
    const startDate = session.slot?.startAt ? parseISO(session.slot.startAt) : null;

    const mentorUser = session.mentorDetails;
    const menteeUser = session.userDetails;

    const displayImage = isMentor ? menteeUser?.profilePicture : mentorUser?.profilePicture;
    const displayName = isMentor ? (menteeUser?.name || `Mentee`) : (mentorUser?.name || "Mentor");
    const displayRole = isMentor ? "Mentee" : "Mentor";


    const canJoin = startDate ? new Date() >= subMinutes(startDate, 1) : false;

    return (
        <Card
            className="mb-4 hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
            onClick={() => onViewDetails(session)}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex items-center space-x-4">
                    <UserAvatar
                        image={displayImage}
                        name={displayName}
                        size={10}
                    />
                    <div>
                        <CardTitle className="text-base font-semibold">
                            Session with {displayName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{displayRole}</p>
                    </div>
                </div>
                <Badge variant={session.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                    {session.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{startDate ? format(startDate, 'PPP') : 'Date N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{startDate ? format(startDate, 'p') : 'Time N/A'}</span>
                    </div>
                </div>

                {session.rescheduleRequest && (
                    <div className="p-3 mt-4 mb-2 rounded bg-blue-50 border border-blue-100" onClick={(e) => e.stopPropagation()}>
                        <p className="mb-1 text-sm font-semibold text-blue-800">Reschedule Requested</p>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-blue-700">
                                <span>Status: <span className="font-medium">{session.rescheduleRequest.status}</span></span>
                                {session.rescheduleRequest.reason && <span className="ml-2 block">Reason: {session.rescheduleRequest.reason}</span>}
                            </div>
                            {isMentor && session.rescheduleRequest.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={(e) => { e.stopPropagation(); onHandleReschedule(session.id, 'APPROVED'); }} className="h-7 text-xs">Approve</Button>
                                    <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); onHandleReschedule(session.id, 'REJECTED'); }} className="h-7 text-xs">Reject</Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {session.status === 'PENDING' && !isMentor && (
                        <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPayClick?.(session);
                            }}
                        >
                            Pay Now
                        </Button>
                    )}

                    {/* Join Session */}
                    {(session.status === 'CONFIRMED' || session.slot?.status === 'STARTED') && canJoin && (
                        <Link
                            to="/session/$sessionId"
                            params={{ sessionId: session.id }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white w-full"
                            >
                                Join Session
                            </Button>
                        </Link>
                    )}

                    {/* Download Receipt */}
                    {session.paymentId && session.paymentId !== "PENDING" && !isMentor && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto hover:bg-muted"
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const response = await import('@/api/api').then(m => m.default.get(
                                        API_ROUTES.PAYMENT.RECEIPT(session.paymentId),
                                        { responseType: 'blob' }
                                    ));

                                    const blob = new Blob([response.data], { type: 'application/pdf' });
                                    const url = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', `receipt-${session.paymentId}.pdf`);
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    window.URL.revokeObjectURL(url);
                                } catch (error) {
                                    console.error('Failed to download receipt', error);
                                }
                            }}
                        >
                            Download Receipt
                        </Button>
                    )}



                    {/* Cancel */}
                    {!isMentor && (session.status === 'CONFIRMED' || session.status === 'PENDING') && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancelClick?.(session);
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card >
    );
};

export default SessionItem;
