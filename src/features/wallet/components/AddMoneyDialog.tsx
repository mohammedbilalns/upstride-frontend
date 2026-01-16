import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadWallet, verifyWalletLoad } from "../services/wallet.service";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";
import { useRazorpay } from "@/shared/hooks/useRazorpay";

interface AddMoneyDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function AddMoneyDialog({ open, onClose, onSuccess }: AddMoneyDialogProps) {
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const isRazorpayLoaded = useRazorpay();

    const handleLoadWallet = async () => {
        if (!isRazorpayLoaded) {
            toast.error("Payment SDK not loaded. Please wait...");
            return;
        }
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (!user) {
            toast.error("User not found");
            return;
        }

        setLoading(true);
        try {
            // Create Order
            const responseData = await loadWallet(amount, user.id);
            const orderData = responseData.data || responseData;

            //  Open Razorpay
            const options = {
                key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "UpStride Wallet",
                description: "Load Wallet Balance",
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        await verifyWalletLoad({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });
                        toast.success("Wallet loaded successfully!");
                        onSuccess();
                        onClose();
                    } catch (error) {
                        console.error("Verification failed", error);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error("Failed to initiate load", error);
            toast.error("Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Money to Wallet</DialogTitle>
                    <DialogDescription>
                        Enter the amount you want to add to your UpStride wallet.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount (₹)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3"
                            placeholder="e.g. 500"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleLoadWallet} disabled={loading}>
                        {loading ? "Processing..." : "Add Money"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
