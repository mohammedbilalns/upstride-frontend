import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { Booking, Slot } from "@/shared/types/session";

export const getSessions = async (type: 'upcoming' | 'history'): Promise<Booking[]> => {
    const response = await api.get(`/sessions?type=${type}`);
    return response.data.data;
};

export const bookSession = async (slotId: string): Promise<{ bookingId: string; paymentId: string }> => {
    const response = await api.post(API_ROUTES.SESSIONS.BOOK_SESSION(slotId));
    return response.data.data;
};

export const getSlots = async (mentorId: string, date?: string): Promise<Slot[]> => {
    const response = await api.get(`${API_ROUTES.SLOTS.GET_MENTOR_SLOTS}?mentorId=${mentorId}&date=${date || ''}`);
    return response.data.slots || [];
};
