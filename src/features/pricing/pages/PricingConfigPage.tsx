import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Info } from "lucide-react";
import { PricingTierForm } from "../components/PricingTierForm";
import {
    getPricingConfig,
    setPricingConfig,
} from "../services/pricing.service";
import type { PricingTier } from "@/shared/types/pricing";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/auth.store";

export function PricingConfigPage() {
    const [tiers, setTiers] = useState<PricingTier[]>([]);
    const { user } = useAuthStore();
    const mentorId = user?.id || "";

    const { data: config, isLoading } = useQuery({
        queryKey: ["pricing-config", mentorId],
        queryFn: () => getPricingConfig(mentorId),
        enabled: !!mentorId,
    });

    useEffect(() => {
        if (config?.pricingTiers && config.pricingTiers.length > 0) {
            setTiers(config.pricingTiers);
        } else if (config && (!config.pricingTiers || config.pricingTiers.length === 0)) {
            // Initialize with default empty tiers for all required durations
            setTiers([
                { duration: 30, price: 0 },
                { duration: 60, price: 0 },
                { duration: 90, price: 0 },
            ]);
        }
    }, [config]);


    const queryClient = useQueryClient();
    const { mutate: savePricing, isPending } = useMutation({
        mutationFn: setPricingConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pricing-config"] });
            toast.success("Pricing configuration saved successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to save pricing configuration");
        },
    });

    const handleSave = () => {
        if (tiers.length < 3) {
            toast.error("Please add pricing for all 3 session durations (30min, 1hr, 1.5hr)");
            return;
        }

        // Validate all required durations are present
        const requiredDurations = [30, 60, 90];
        const configuredDurations = tiers.map(t => t.duration);
        const missingDurations = requiredDurations.filter(d => !configuredDurations.includes(d));

        if (missingDurations.length > 0) {
            toast.error(`Missing pricing for: ${missingDurations.join(", ")} minute sessions`);
            return;
        }

        // Validate pricing rules
        for (let i = 0; i < tiers.length - 1; i++) {
            if (tiers[i].price > tiers[i + 1].price) {
                toast.error(
                    "Invalid pricing: Shorter sessions cannot cost more than longer ones",
                );
                return;
            }
        }

        savePricing({ pricingTiers: tiers });
    };
    ;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pricing Configuration</h1>
                <p className="text-muted-foreground mt-2">
                    Configure pricing for all three session durations (30min, 1hr, 1.5hr).
                    You'll earn 90% of each session price.
                </p>
            </div>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    {config && config.pricingTiers.length > 0 ? (
                        <>Platform commission is 10%. Your earnings will be 90% of the price you set for each tier.</>
                    ) : (
                        <strong>Pricing not configured. Please add pricing for all 3 session durations to start accepting bookings.</strong>
                    )}
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>Session Pricing Tiers</CardTitle>
                    <CardDescription>
                        Configure pricing for different session durations. Shorter sessions
                        cannot cost more than longer ones.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PricingTierForm tiers={tiers} onChange={setTiers} />

                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={isPending || tiers.length === 0}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Pricing Configuration
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
