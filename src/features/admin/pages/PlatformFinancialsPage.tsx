import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, DollarSign, TrendingUp, Activity } from "lucide-react";
import { getPlatformAnalytics } from "../services/analytics.service";
import { format } from "date-fns";

export function PlatformFinancialsPage() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ["platform-analytics"],
        queryFn: getPlatformAnalytics,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!analytics) {
        return <div>No analytics data available</div>;
    }

    return (
        <div className="container py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Platform Financials</h1>
                <p className="text-muted-foreground mt-2">
                    View platform revenue, wallet balance, and transaction statistics
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Platform Balance
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{analytics.platformBalance.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current wallet balance
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{analytics.totalRevenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All-time commissions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Transactions
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.totalTransactions}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Recent transaction count
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {analytics.recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between py-3 border-b last:border-0"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(transaction.createdAt), "PPp")}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-green-600">
                                    +₹{transaction.amount.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
