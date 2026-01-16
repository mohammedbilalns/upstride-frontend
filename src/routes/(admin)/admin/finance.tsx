import { createFileRoute } from '@tanstack/react-router'
import FinancialOverviewPage from '@/features/wallet/pages/AdminWalletPage'
import { getPlatformAnalytics } from '@/features/wallet/services/wallet.service'

export const Route = createFileRoute('/(admin)/admin/finance')({
  component: FinancialOverviewPage,
  loaderDeps: ({ search: { page, limit } }) => ({ page, limit }),
  validateSearch: (search: Record<string, unknown>): { page?: number, limit?: number } => {
    return {
      page: Number(search.page) || 1,
      limit: Number(search.limit) || 10
    }
  },
  loader: async ({ context, deps: { page, limit } }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ["platform-analytics", page, limit],
      queryFn: () => getPlatformAnalytics(page, limit),
    })
  }
})
