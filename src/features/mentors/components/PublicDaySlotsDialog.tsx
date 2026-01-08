import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { formatTime } from "@/shared/utils/dateUtil";
import { format } from "date-fns";
import type { Slot } from "@/shared/types/session";
import { ConfirmDialog } from "@/components/common/Confirm";

interface PublicDaySlotsDialogProps {
    date: Date | undefined;
    slots: Slot[];
    isOpen: boolean;
    onClose: () => void;
    onBookSlot: (slotId: string) => void;
    processingSlotId: string | null;
}

export default function PublicDaySlotsDialog({
    date,
    slots,
    isOpen,
    onClose,
    onBookSlot,
    processingSlotId
}: PublicDaySlotsDialogProps) {
    if (!date) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{format(date, "EEEE, MMMM do, yyyy")}</DialogTitle>
                    <DialogDescription>
                        Available sessions for this date.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {slots.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">
                            No slots available for this date.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-1">
                            {slots.map((slot) => {
                                const isProcessing = processingSlotId === slot.id;
                                return (
                                    <div key={slot.id} className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {formatTime(slot.startAt)} - {formatTime(slot.endAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span className="font-semibold text-foreground text-primary">
                                                    ₹ {slot.price}
                                                </span>
                                            </div>
                                        </div>
                                        <ConfirmDialog
                                            title="Book Session"
                                            description={`Are you sure you want to book this session for ₹ ${slot.price}?`}
                                            onConfirm={() => onBookSlot(slot.id)}
                                            confirmText="Confirm Booking"
                                        >
                                            <Button
                                                disabled={!!processingSlotId}
                                                variant="default"
                                                size="sm"
                                            >
                                                {isProcessing ? "Processing..." : "Book Session"}
                                            </Button>
                                        </ConfirmDialog>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
