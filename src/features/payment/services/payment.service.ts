import api from "@/api/api";

export interface CreatePaymentDto {
    bookingId: string;
    amount: number;
    currency: string;
}

export const createPayment = async (data: CreatePaymentDto) => {
    const response = await api.post(`/payments`, data);
    return response.data;
};

export const capturePayment = async (paymentId: string, transactionId: string) => {
    const response = await api.post(`/payments/capture`, { paymentId, transactionId });
    return response.data;
};
