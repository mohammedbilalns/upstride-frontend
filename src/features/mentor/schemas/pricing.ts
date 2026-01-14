import z from "zod";

export const pricingSchema = z.object({
    tier30: z.number().min(0, "Price must be positive"),
    tier60: z.number().min(0, "Price must be positive"),
    tier90: z.number().min(0, "Price must be positive"),
}).refine((data) => {
    if (data.tier30 > data.tier60 && data.tier60 > 0) return false;
    if (data.tier60 > data.tier90 && data.tier90 > 0) return false;
    return true;
}, {
    message: "Shorter sessions cannot cost more than longer ones",
    path: ["tier30"],
});

export type PricingFormValues = z.infer<typeof pricingSchema>;
