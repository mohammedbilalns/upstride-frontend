import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Clock, CreditCard, AlignLeft, Info } from 'lucide-react';
import UserAvatar from '@/components/common/UserAvatar';
import type { Booking } from '@/shared/types/session';

interface SessionDetailsDialogProps {
    booking: Booking | null;
    open: boolean;
    onClose: () => void;
    isMentor: boolean;

    onHandleReschedule: (bookingId: string, action: 'APPROVED' | 'REJECTED') => void;
}

const SessionDetailsDialog = ({ booking, open, onClose, isMentor, onHandleReschedule }: SessionDetailsDialogProps) => {
    if (!booking) return null;

    const startDate = booking.slot?.startAt ? parseISO(booking.slot.startAt) : null;
    const endDate = booking.slot?.endAt ? parseISO(booking.slot.endAt) : null;

    // Use populated details
    const mentorUser = booking.mentorDetails;
    const menteeUser = booking.userDetails;

    const displayImage = isMentor ? menteeUser?.profilePicture : mentorUser?.profilePicture;
    const displayName = isMentor ? menteeUser?.name || `Mentee ${booking.userId}` : mentorUser?.name || "Mentor";
    const displayRole = isMentor ? "Mentee" : "Mentor";
    const displayEmail = isMentor ? menteeUser?.email : mentorUser?.email;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Session Details</DialogTitle>
                    <DialogDescription>
                        Full information about this mentorship session.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                        <UserAvatar image={displayImage} name={displayName} size={12} />
                        <div>
                            <p className="font-semibold text-lg">{displayName}</p>
                            <p className="text-sm text-muted-foreground">{displayRole}</p>
                            {displayEmail && <p className="text-xs text-muted-foreground">{displayEmail}</p>}
                        </div>
                    </div>

                    {/* Time & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" /> Date
                            </span>
                            <span className="font-medium text-sm">
                                {startDate ? format(startDate, 'PPP') : 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Time
                            </span>
                            <span className="font-medium text-sm">
                                {startDate && endDate
                                    ? `${format(startDate, 'p')} - ${format(endDate, 'p')}`
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Status & Payment */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Info className="w-3 h-3" /> Status
                            </span>
                            <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'} className="w-fit">
                                {booking.status}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> Payment ID
                            </span>
                            <span className="font-medium text-sm break-all">
                                {booking.paymentDetails
                                    ? `${booking.paymentDetails.currency} ${booking.paymentDetails.amount}`
                                    : booking.paymentId || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Description if any */}
                    {booking.slot?.description && (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlignLeft className="w-3 h-3" /> Topic / Description
                            </span>
                            <p className="text-sm">{booking.slot.description}</p>
                        </div>
                    )}

                    {/* Reschedule Request Info */}
                    {booking.rescheduleRequest && (
                        <div className="p-3 rounded bg-blue-50 border border-blue-100 text-sm">
                            <p className="font-semibold text-blue-800 mb-1">Reschedule Info</p>
                            <p className="text-blue-700">Status: {booking.rescheduleRequest.status}</p>
                            {booking.rescheduleRequest.reason && <p className="text-blue-600">Reason: {booking.rescheduleRequest.reason}</p>}

                            {isMentor && booking.rescheduleRequest.status === 'PENDING' && (
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" onClick={() => onHandleReschedule(booking.id, 'APPROVED')} className="h-8">Approve Request</Button>
                                    <Button size="sm" variant="destructive" onClick={() => onHandleReschedule(booking.id, 'REJECTED')} className="h-8">Reject</Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    <div className="flex gap-2 w-full justify-end">

                        <Button type="button" variant="secondary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SessionDetailsDialog;
