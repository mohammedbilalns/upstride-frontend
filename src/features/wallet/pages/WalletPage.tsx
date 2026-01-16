import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getRouteApi } from "@tanstack/react-router";
import { walletDetailsQueryOptions } from "../services/wallet.service";
import AddMoneyDialog from "../components/AddMoneyDialog";
import { Pagination } from "@/components/common/Pagination";

const route = getRouteApi('/(authenticated)/wallet');

export function WalletPage() {
    const { page, limit } = route.useSearch();
    const navigate = route.useNavigate();
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);

    const { data: walletDetails, refetch } = useSuspenseQuery(
        walletDetailsQueryOptions(page, limit)
    );

    const { balance, currency, transactions, totalTransactions } = walletDetails;

    const handlePageChange = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage }),
        });
    };

    const handleLimitChange = (newLimit: number) => {
        navigate({
            search: (prev) => ({ ...prev, limit: newLimit, page: 1 }),
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your funds and view transaction history
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Balance Card */}
                <Card className="bg-primary text-primary-foreground border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">
                            Available Balance
                        </CardTitle>
                        <Wallet className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">
                            {currency || "INR"} {balance?.toFixed(2) || "0.00"}
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-6 w-full sm:w-auto font-medium"
                            onClick={() => setIsAddMoneyOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Money
                        </Button>
                    </CardContent>
                </Card>

                {/* Transactions */}
                <Card className="rounded-xl border bg-card text-card-foreground shadow">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>A detailed list of your recent wallet activity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {(!transactions || transactions.length === 0) ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-muted p-4 mb-3">
                                        <Wallet className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-lg font-medium">No transactions yet</p>
                                    <p className="text-sm text-muted-foreground">Add money to get started.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map((txn: any) => (
                                        <div key={txn.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-2.5 rounded-full shrink-0 ${txn.amount >= 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                                    {txn.amount >= 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium leading-none mb-1">{txn.description || "Transaction"}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(txn.createdAt), "PPP p")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1 pl-14 sm:pl-0">
                                                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">{txn.amount >= 0 ? 'CREDIT' : 'DEBIT'}</Badge>
                                                <div className={`font-bold text-base ${txn.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {txn.amount >= 0 ? '+' : '-'} {currency} {Math.abs(txn.amount).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <Pagination
                                    page={page}
                                    totalPages={Math.ceil((totalTransactions || 0) / limit)}
                                    rowsPerPage={limit}
                                    setPage={handlePageChange}
                                    setRowsPerPage={handleLimitChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AddMoneyDialog
                open={isAddMoneyOpen}
                onClose={() => setIsAddMoneyOpen(false)}
                onSuccess={refetch}
            />
        </div>
    );
}
