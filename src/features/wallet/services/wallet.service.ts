import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type {
    OwnerType,
    TransactionListResponse,
    WalletBalanceResponse,
} from "@/shared/types/wallet";

export const getWalletBalance = async (
    ownerType: OwnerType,
): Promise<WalletBalanceResponse> => {
    const response = await api.get(
        `${API_ROUTES.WALLETS.GET_BALANCE}?ownerType=${ownerType}`,
    );
    return response.data.data;
};

export const getTransactionHistory = async (
    ownerType: OwnerType,
    limit = 50,
    offset = 0,
): Promise<TransactionListResponse[]> => {
    const response = await api.get(
        `${API_ROUTES.WALLETS.GET_TRANSACTIONS}?ownerType=${ownerType}&limit=${limit}&offset=${offset}`,
    );
    return response.data.data;
};
