import { useQuery } from "@tanstack/react-query";
import { getWalletBalance, getTransactionHistory, getPlatformAnalytics } from "../services/wallet.service";
import type { OwnerType } from "@/shared/types/wallet";

export function useWalletBalance(ownerType: OwnerType = "USER") {
    return useQuery({
        queryKey: ["wallet-balance", ownerType],
        queryFn: () => getWalletBalance(ownerType),
    });
}

export function useTransactionHistory(ownerType: OwnerType = "USER", limit = 10, offset = 0) {
    return useQuery({
        queryKey: ["wallet-transactions", ownerType, limit, offset],
        queryFn: () => getTransactionHistory(ownerType, limit, offset),
    });
}

export function usePlatformAnalytics() {
    return useQuery({
        queryKey: ["platform-analytics"],
        queryFn: () => getPlatformAnalytics(),
    });
}
