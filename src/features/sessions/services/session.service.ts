import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { Booking, Slot } from "@/shared/types/session";

import { queryOptions } from "@tanstack/react-query";

export const getSessions = async (
    type?: "upcoming" | "history",
): Promise<Booking[]> => {
    // Deprecated in favor of getSessionsList
    const query = type ? `?type=${type}` : "";
    const response = await api.get(`/sessions${query}`);
    return response.data.data;
};

export const requestReschedule = async ({
    bookingId,
    requestedSlotId,
    reason,
}: {
    bookingId: string;
    requestedSlotId: string;
    reason?: string;
}) => {
    const response = await api.post(API_ROUTES.SESSIONS.RESCHEDULE(bookingId), {
        requestedSlotId,
        reason,
    });
    return response.data;
};

export const handleReschedule = async ({
    bookingId,
    action,
}: {
    bookingId: string;
    action: "APPROVED" | "REJECTED";
}) => {
    const response = await api.post(API_ROUTES.SESSIONS.HANDLE_RESCHEDULE(bookingId), {
        action,
    });
    return response.data;
};

export const bookSession = async (
    slotId: string,
): Promise<{ bookingId: string; paymentId: string }> => {
    const response = await api.post(API_ROUTES.SESSIONS.BOOK_SESSION(slotId));
    return response.data.data;
};

export const cancelBooking = async (bookingId: string) => {
    const response = await api.post(API_ROUTES.SESSIONS.CANCEL(bookingId));
    return response.data;
};

export const cancelReservation = async (slotId: string) => {
    const response = await api.post(API_ROUTES.SESSIONS.CANCEL_RESERVATION(slotId));
    return response.data;
};

export const getSlots = async (
    mentorId: string,
    month?: number,
    year?: number,
    availableOnly?: boolean,
): Promise<Slot[]> => {
    const params: any = { mentorId, availableOnly: availableOnly || false };
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;

    const response = await api.get(API_ROUTES.SLOTS.GET_MENTOR_SLOTS, {
        params,
    });
    return response.data.slots || [];
};

export const getAvailableSlots = async (
    mentorId: string,
    month?: number,
    year?: number,
): Promise<Slot[]> => {
    const params: any = { mentorId, month, year };
    const response = await api.get(API_ROUTES.SLOTS.GET_AVAILABLE_SLOTS, {
        params,
    });
    return response.data.slots || [];
};

export const upcomingSessionsQueryOptions = queryOptions({
    queryKey: ["sessions", "upcoming"],
    queryFn: () => getSessions("upcoming"),
});

export const historySessionsQueryOptions = queryOptions({
    queryKey: ["sessions", "history"],
    queryFn: () => getSessions("history"),
});

export const getSessionsList = async ({
    pageParam = 1,
    type = "upcoming"
}: {
    pageParam?: number,
    type?: "upcoming" | "history"
}): Promise<{ sessions: Booking[], total: number }> => {
    const response = await api.get(API_ROUTES.SESSIONS.LIST, {
        params: {
            page: pageParam,
            limit: 15,
            type
        }
    });
    return response.data.data;
};

