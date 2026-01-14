export interface PlatformAnalytics {
    platformBalance: number;
    totalRevenue: number;
    totalTransactions: number;
    recentTransactions: Array<{
        id: string;
        amount: number;
        description: string;
        createdAt: string;
    }>;
}
