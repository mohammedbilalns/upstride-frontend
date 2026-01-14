import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, TrendingUp } from "lucide-react";
import type { WalletBalanceResponse } from "@/shared/types/wallet";

interface WalletBalanceCardProps {
    balance: WalletBalanceResponse;
    ownerType: "USER" | "MENTOR";
}

export function WalletBalanceCard({
    balance,
    ownerType,
}: WalletBalanceCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                    {ownerType === "USER" ? "Your Balance" : "Mentor Earnings"}
                </CardTitle>
                {ownerType === "USER" ? (
                    <WalletIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    ₹{balance.balance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {balance.currency} Currency
                </p>
            </CardContent>
        </Card>
    );
}
