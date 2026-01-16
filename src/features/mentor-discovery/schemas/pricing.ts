import z from "zod";

export const pricingSchema = z.object({
    tier30: z.number().or(z.nan()).refine((val) => !Number.isNaN(val), { message: "Please enter a valid amount" }).refine((val) => val >= 100, { message: "Price must be at least 100" }).refine((val) => val <= 10000, { message: "Price cannot exceed 10000" }),
    tier60: z.number().or(z.nan()).refine((val) => !Number.isNaN(val), { message: "Please enter a valid amount" }).refine((val) => val >= 100, { message: "Price must be at least 100" }).refine((val) => val <= 10000, { message: "Price cannot exceed 10000" }),
    tier90: z.number().or(z.nan()).refine((val) => !Number.isNaN(val), { message: "Please enter a valid amount" }).refine((val) => val >= 100, { message: "Price must be at least 100" }).refine((val) => val <= 10000, { message: "Price cannot exceed 10000" }),
    updateExistingSlots: z.boolean().default(false).optional(),
}).refine((data) => {
    if (data.tier30 > data.tier60 && data.tier60 > 0) return false;
    if (data.tier60 > data.tier90 && data.tier90 > 0) return false;
    return true;
}, {
    message: "Shorter sessions cannot cost more than longer ones",
    path: ["tier30"],
});

export type PricingFormValues = z.infer<typeof pricingSchema>;
