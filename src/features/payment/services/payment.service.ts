import api from "@/api/api";

export interface CreatePaymentDto {
    bookingId: string;
    amount: number;
    currency: string;
    mentorId: string;
    userId: string;
}

export const createPayment = async (data: CreatePaymentDto) => {
    const response = await api.post(`/payments/`, data);
    return response.data;
};

export const capturePayment = async (data: {
    orderId: string;
    paymentId: string;
    signature: string;
}) => {
    const response = await api.post(`/payments/capture`, data);
    return response.data;
};

export const verifyPayment = async (data: {
    orderId: string;
    paymentId: string;
    signature: string;
}) => {

    return capturePayment(data);
};
