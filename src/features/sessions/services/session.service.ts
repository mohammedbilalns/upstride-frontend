import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { Booking, Slot } from "@/shared/types/session";

export const getSessions = async (type?: 'upcoming' | 'history'): Promise<Booking[]> => {
    const query = type ? `?type=${type}` : '';
    const response = await api.get(`/sessions${query}`);
    return response.data.data;
};

export const requestReschedule = async ({ bookingId, requestedSlotId, reason }: { bookingId: string, requestedSlotId: string, reason?: string }) => {
    const response = await api.post(`/sessions/${bookingId}/reschedule`, { requestedSlotId, reason });
    return response.data;
};

export const handleReschedule = async ({ bookingId, action }: { bookingId: string, action: 'APPROVED' | 'REJECTED' }) => {
    const response = await api.post(`/sessions/${bookingId}/reschedule/handle`, { action });
    return response.data;
};

export const bookSession = async (slotId: string): Promise<{ bookingId: string; paymentId: string }> => {
    const response = await api.post(API_ROUTES.SESSIONS.BOOK_SESSION(slotId));
    return response.data.data;
};

export const getSlots = async (mentorId: string, date?: string, availableOnly?: boolean): Promise<Slot[]> => {
    const response = await api.get(`${API_ROUTES.SLOTS.GET_MENTOR_SLOTS}?mentorId=${mentorId}&date=${date || ''}&availableOnly=${availableOnly || false}`);
    return response.data.slots || [];
};
