import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/shared/utils/dateUtil";
import { ConfirmDialog } from "@/components/common/Confirm";
import { format } from "date-fns";

interface DaySlotsDialogProps {
    date: Date | undefined;
    slots: any[];
    isOpen: boolean;
    onClose: () => void;
    onDeleteSlot: (slotId: string) => void;
    onAddSlot: () => void;
}

export default function DaySlotsDialog({ date, slots, isOpen, onClose, onDeleteSlot, onAddSlot }: DaySlotsDialogProps) {
    if (!date) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{format(date, "EEEE, MMMM do, yyyy")}</DialogTitle>
                    <DialogDescription>
                        Manage your availability for this date.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {slots.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8 border rounded-lg border-dashed">
                            No slots available for this date.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
                            {slots.map((slot: any) => {
                                const isBooked = slot.status !== 'OPEN' && slot.status !== 'CANCELLED';
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
                                                <span className="font-semibold text-foreground">₹{slot.price}</span>
                                                <span>•</span>
                                                <span className="capitalize">{slot.generatedFrom === 'custom' ? 'Custom Slot' : 'Recurring Rule'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isBooked ? (
                                                <Badge variant="destructive">Booked</Badge>
                                            ) : (
                                                <>
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Open</Badge>
                                                    <ConfirmDialog
                                                        title="Delete Slot"
                                                        description="Are you sure you want to delete this slot? This action cannot be undone."
                                                        onConfirm={() => onDeleteSlot(slot.id)}
                                                        confirmText="Delete"
                                                        variant="destructive"
                                                    >
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </ConfirmDialog>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button onClick={onAddSlot} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Slot
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
