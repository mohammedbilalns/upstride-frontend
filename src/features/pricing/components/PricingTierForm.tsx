import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import type { PricingTier } from "@/shared/types/pricing";

interface PricingTierFormProps {
    tiers: PricingTier[];
    onChange: (tiers: PricingTier[]) => void;
}

// Only support 30min, 1hr (60min), and 1.5hr (90min) sessions
const DURATION_OPTIONS = [30, 60, 90] as const;

export function PricingTierForm({ tiers, onChange }: PricingTierFormProps) {
    const [newDuration, setNewDuration] = useState<number>(30);
    const [newPrice, setNewPrice] = useState<string>("");

    const addTier = () => {
        if (!newPrice || Number.parseFloat(newPrice) <= 0) return;

        const tierExists = tiers.some((t) => t.duration === newDuration);
        if (tierExists) {
            alert("A tier with this duration already exists");
            return;
        }

        const updatedTiers = [
            ...tiers,
            { duration: newDuration, price: Number.parseFloat(newPrice) },
        ].sort((a, b) => a.duration - b.duration);

        onChange(updatedTiers);
        setNewPrice("");
    };

    const removeTier = (duration: number) => {
        onChange(tiers.filter((t) => t.duration !== duration));
    };

    const updatePrice = (duration: number, priceStr: string) => {
        const price = parseFloat(priceStr);
        if (isNaN(price)) return; // Allow empty string or partial input handling if needed, but for now simple update

        const updatedTiers = tiers.map((t) =>
            t.duration === duration ? { ...t, price } : t
        );
        onChange(updatedTiers);
    };

    const allTiersPresent = DURATION_OPTIONS.every((d) =>
        tiers.some((t) => t.duration === d),
    );

    return (
        <div className="space-y-6">
            {!allTiersPresent && (
                <div className="grid gap-4 md:grid-cols-3 p-4 border rounded-md bg-muted/20">
                    <div>
                        <Label>Duration (minutes)</Label>
                        <Select
                            value={newDuration.toString()}
                            onValueChange={(v) => setNewDuration(Number.parseInt(v))}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {DURATION_OPTIONS.filter(
                                    (d) => !tiers.some((t) => t.duration === d),
                                ).map((duration) => (
                                    <SelectItem key={duration} value={duration.toString()}>
                                        {duration} minutes
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Price (INR)</Label>
                        <Input
                            type="number"
                            placeholder="Enter price"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTier();
                                }
                            }}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button type="button" onClick={addTier} className="w-full">
                            Add Tier
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">
                    Your Pricing Configuration
                </h3>
                <div className="grid gap-4">
                    {tiers.map((tier) => (
                        <Card key={tier.duration}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-24 font-medium text-lg">
                                        {tier.duration} min
                                    </div>
                                    <div className="flex-1 max-w-xs">
                                        <Label className="text-xs text-muted-foreground mb-1 block">
                                            Price (INR)
                                        </Label>
                                        <Input
                                            type="number"
                                            value={tier.price === 0 ? "" : tier.price}
                                            placeholder="0"
                                            onChange={(e) =>
                                                updatePrice(tier.duration, e.target.value)
                                            }
                                            className="max-w-[150px]"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-emerald-600">
                                            Earnings: ₹{(tier.price * 0.9).toFixed(2)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            (Platform fee: 10%)
                                        </span>
                                    </div>
                                </div>
                                {/* Only allow removing if not all tiers present (conceptually) or just allow removal to re-add */}
                                {/* Actually, if we mandate all 3, maybe removal isn't necessary if we pre-populate.
                                    But let's keep it for flexibility, or maybe replace it with "Reset"?
                                    Let's keep remove for now, but if they remove, the "Add Tier" form appears.
                                */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTier(tier.duration)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
