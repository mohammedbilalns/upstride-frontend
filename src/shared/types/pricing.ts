export interface PricingTier {
    duration: number; // in minutes (30, 60, 90, 120)
    price: number; // in INR
}

export interface PricingConfig {
    id: string;
    mentorId: string;
    pricingTiers: PricingTier[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PricingConfigResponse {
    id: string;
    mentorId: string;
    pricingTiers: PricingTier[];
    mentorEarnings: Array<{
        duration: number;
        earnings: number;
    }>;
    isActive: boolean;
}

export interface SetPricingConfigRequest {
    pricingTiers: PricingTier[];
}
