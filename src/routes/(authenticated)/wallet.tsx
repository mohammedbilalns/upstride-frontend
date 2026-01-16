import { createFileRoute } from '@tanstack/react-router'
import { WalletPage } from '@/features/wallet/pages/WalletPage'
import { z } from 'zod'
import { walletDetailsQueryOptions } from "@/features/wallet/services/wallet.service";

const walletSearchSchema = z.object({
  page: z.number().min(1).catch(1),
  limit: z.number().min(1).catch(10),
})

export const Route = createFileRoute('/(authenticated)/wallet')({
  component: WalletPage,
  validateSearch: (search) => walletSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps: { search } }) => {
    await context.queryClient.ensureQueryData(
      walletDetailsQueryOptions(search.page, search.limit)
    );
  },
})
