import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { PlatformAnalytics } from "@/shared/types/analytics";

export const getPlatformAnalytics = async (): Promise<PlatformAnalytics> => {
    const response = await api.get(API_ROUTES.ANALYTICS.GET_PLATFORM);
    return response.data.data;
};
