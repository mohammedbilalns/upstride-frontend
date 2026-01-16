import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type {
    OwnerType,
    TransactionListResponse,
    WalletBalanceResponse,
} from "@/shared/types/wallet";

export interface PlatformAnalytics {
    platformBalance: number;
    totalRevenue: number;
    totalTransactions: number;
    transactions: TransactionListResponse[];
}

export const getWalletBalance = async (
    ownerType: OwnerType,
): Promise<WalletBalanceResponse> => {
    const response = await api.get(
        `${API_ROUTES.WALLETS.GET_BALANCE}?ownerType=${ownerType}`,
    );
    return response.data.data;
};

export interface WalletDetailsResponse {
    balance: number;
    currency: string;
    totalTransactions: number;
    transactions: TransactionListResponse[];
}

import { queryOptions } from "@tanstack/react-query";

export const getWalletDetails = async (page = 1, limit = 10): Promise<WalletDetailsResponse> => {
    const response = await api.get(API_ROUTES.WALLETS.GET_DETAILS, {
        params: { page, limit }
    });
    return response.data.data;
};

export const walletDetailsQueryOptions = (page: number, limit: number) =>
    queryOptions({
        queryKey: ["wallet-details", page, limit],
        queryFn: () => getWalletDetails(page, limit),
    });

export const loadWallet = async (amount: number, userId: string) => {
    const response = await api.post(API_ROUTES.PAYMENT.CREATE, {
        amount,
        userId,
        paymentType: 'WALLET_LOAD',
        currency: 'INR'
    });
    return response.data;
};

export const verifyWalletLoad = async (payload: { orderId: string; paymentId: string; signature: string }) => {
    const response = await api.post(API_ROUTES.PAYMENT.CAPTURE, payload);
    return response.data;
};


export const getPlatformAnalytics = async (page = 1, limit = 10): Promise<PlatformAnalytics> => {
    const response = await api.get(API_ROUTES.FINANCE.GET_PLATFORM, {
        params: { page, limit }
    });
    return response.data.data;
};

export const payWithWallet = async (data: { bookingId: string, mentorId: string, amount: number, slotId: string }) => {
    const response = await api.post(API_ROUTES.WALLETS.PAY, data);
    return response.data;
};
