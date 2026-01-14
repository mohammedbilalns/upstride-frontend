export type OwnerType = "USER" | "MENTOR" | "PLATFORM";

export type TransactionType = "PAYMENT" | "REFUND" | "COMMISSION" | "WITHDRAWAL";

export interface Wallet {
    id: string;
    ownerId: string;
    ownerType: OwnerType;
    balance: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    transactionType: TransactionType;
    amount: number;
    balance: number;
    description: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export interface WalletBalanceResponse {
    walletId: string;
    balance: number;
    currency: string;
}

export interface TransactionListResponse {
    id: string;
    transactionType: string;
    amount: number;
    balance: number;
    description: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}
