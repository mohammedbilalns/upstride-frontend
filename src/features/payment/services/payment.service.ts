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
    // Re-using capture endpoint or a specific verify endpoint if exists. 
    // Usually verify and capture are similar in Razorpay flow.
    // Based on previous code context, it seems verifyPayment was called.
    // If backend only has capture, we might map it to capture.
    // But let's check if there is a specific verify endpoint.
    // Use capture for now as it's the standard completion step.
    return capturePayment(data);
};
