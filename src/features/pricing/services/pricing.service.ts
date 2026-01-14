import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type {
    PricingConfigResponse,
    SetPricingConfigRequest,
} from "@/shared/types/pricing";
import { queryOptions } from "@tanstack/react-query";

export const setPricingConfig = async (
    data: SetPricingConfigRequest,
): Promise<PricingConfigResponse> => {
    const response = await api.post(API_ROUTES.PRICING.SET_CONFIG, data);
    return response.data.data;
};

const getPricingConfig = async (
    mentorId: string,
): Promise<PricingConfigResponse> => {
    const response = await api.get(API_ROUTES.PRICING.GET_CONFIG(mentorId));
    return response.data.data;
};


export const pricingQueryOptions = (mentorId: string) => queryOptions({
    queryKey: ["pricing-config", mentorId],
    queryFn: () => getPricingConfig(mentorId),
});
