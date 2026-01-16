import { useSuspenseQuery } from "@tanstack/react-query";
import { IndianRupee, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getPlatformAnalytics } from "../services/wallet.service";
import { Route } from "@/routes/(admin)/admin/finance";
import { Pagination } from "@/components/common/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export default function FinancialOverviewPage() {
    const { page, limit } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
    const data = Route.useLoaderData();

    const { data: analytics } = useSuspenseQuery({
        queryKey: ["platform-analytics", page, limit],
        queryFn: () => getPlatformAnalytics(page, limit),
        initialData: data
    });

    const totalPages = Math.ceil(analytics.totalTransactions / (limit || 10));
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const setPage = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage }),
        });
    };

    const setRowsPerPage = (newLimit: number) => {
        navigate({
            search: (prev) => ({ ...prev, limit: newLimit, page: 1 }),
        });
    };

    const toggleExpanded = (id: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6">
                {/* Revenue Card  */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Platform Balance (Revenue)
                            </CardTitle>
                            <IndianRupee className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{analytics.platformBalance?.toLocaleString('en-IN') || "0.00"}</div>
                            <p className="text-xs text-muted-foreground">
                                Current available balance
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card rounded-xl shadow-lg border border-border/50 backdrop-blur-sm p-4 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                            Financial Transactions
                        </h1>
                        <div className="text-muted-foreground text-sm">
                            Total: {analytics.totalTransactions}
                        </div>
                    </div>

                    <div className="min-h-[50vh] overflow-x-auto rounded-lg border border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-8"></TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics.transactions?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            No transactions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    analytics.transactions?.map((txn) => (
                                        <Fragment key={txn.id}>
                                            <TableRow className="hover:bg-muted/50">
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleExpanded(txn.id)}
                                                        className="p-0 h-6 w-6"
                                                    >
                                                        {expandedRows.has(txn.id) ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {format(new Date(txn.createdAt), "MMM d, yyyy HH:mm")}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate" title={txn.description}>
                                                    {txn.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{txn.transactionType.toLowerCase()}</Badge>
                                                </TableCell>
                                                <TableCell className={`text-right font-bold ${['COMMISSION', 'PAYMENT', 'REFUND'].includes(txn.transactionType)
                                                    ? 'text-emerald-600'
                                                    : 'text-foreground'
                                                    }`}>
                                                    ₹{txn.amount}
                                                </TableCell>
                                            </TableRow>

                                            {expandedRows.has(txn.id) && (
                                                <TableRow className="bg-muted/30">
                                                    <TableCell colSpan={5} className="p-4">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="font-semibold block text-muted-foreground">Detailed Description</span>
                                                                {txn.description}
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold block text-muted-foreground">Transaction Metadata</span>
                                                                ID: {txn.id}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination
                        page={page || 1}
                        totalPages={totalPages}
                        rowsPerPage={limit || 10}
                        setPage={setPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                </div>
            </div>
        </div>
    );
}
