import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletBalanceCard } from "../components/WalletBalanceCard";
import { TransactionList } from "../components/TransactionList";
import {
    getWalletBalance,
    getTransactionHistory,
} from "../services/wallet.service";

type WalletTab = "USER" | "MENTOR";

export function WalletPage() {
    const [activeTab, setActiveTab] = useState<WalletTab>("USER");

    const { data: balance, isLoading: balanceLoading } = useQuery({
        queryKey: ["wallet-balance", activeTab],
        queryFn: () => getWalletBalance(activeTab),
    });

    const { data: transactions = [], isLoading: transactionsLoading } = useQuery(
        {
            queryKey: ["wallet-transactions", activeTab],
            queryFn: () => getTransactionHistory(activeTab, 50, 0),
        },
    );

    if (balanceLoading || transactionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Wallet</h1>
                <p className="text-muted-foreground mt-2">
                    View your balance and transaction history
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WalletTab)}>
                <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                    <TabsTrigger value="USER">User Wallet</TabsTrigger>
                    <TabsTrigger value="MENTOR">Mentor Earnings</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="space-y-6">
                    {balance && (
                        <WalletBalanceCard balance={balance} ownerType={activeTab} />
                    )}
                    <TransactionList transactions={transactions} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
