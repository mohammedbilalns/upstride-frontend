import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, RefreshCw } from "lucide-react";
import type { TransactionListResponse } from "@/shared/types/wallet";
import { format } from "date-fns";

interface TransactionListProps {
    transactions: TransactionListResponse[];
}

const getTransactionIcon = (type: string, amount: number) => {
    switch (type) {
        case "PAYMENT":
            return amount < 0
                ? <ArrowDownCircle className="h-4 w-4 text-red-600" />
                : <ArrowUpCircle className="h-4 w-4 text-green-600" />;
        case "REFUND":
            return <RefreshCw className="h-4 w-4 text-blue-600" />;
        case "COMMISSION":
            return <DollarSign className="h-4 w-4 text-purple-600" />;
        case "WITHDRAWAL":
            return <ArrowDownCircle className="h-4 w-4 text-red-600" />;
        default:
            return null;
    }
};

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    No transactions yet
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                    Your recent wallet transactions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between py-3 border-b last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                {getTransactionIcon(transaction.transactionType, transaction.amount)}
                                <div>
                                    <p className="text-sm font-medium">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(transaction.createdAt), "PPp")}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`text-sm font-semibold ${Number(transaction.amount) < 0 ? "text-red-600" : "text-green-600"}`}
                                >
                                    {Number(transaction.amount) < 0 ? "-" : "+"}₹
                                    {Math.abs(Number(transaction.amount)).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Balance: ₹{transaction.balance.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
