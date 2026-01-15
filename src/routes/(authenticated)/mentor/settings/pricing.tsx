import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authGuard } from "@/shared/guards/auth-gaurd";
import { setPricingConfig } from "@/features/pricing/services/pricing.service";
import { pricingSchema, type PricingFormValues } from "@/features/mentor-discovery/schemas/pricing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { pricingQueryOptions } from "@/features/pricing/services/pricing.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(authenticated)/mentor/settings/pricing")({
  component: PricingSettingsPage,
  beforeLoad: authGuard(["mentor"]),
  loader: async ({ context }) => {
    const user = context.authStore.getState().user;
    if (!user || !user.mentorId) throw new Error("User not found");
    context.queryClient.ensureQueryData(pricingQueryOptions(user.mentorId));
    return {
      mentorId: user.mentorId
    }
  }
});

function PricingSettingsPage() {
  const {mentorId}  = Route.useLoaderData()
  const queryClient = useQueryClient();
  const { data: pricing } = useSuspenseQuery(pricingQueryOptions(mentorId));

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    mode: "onChange"
  });

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = form;

  useEffect(() => {
    if (!pricing) return;
    reset({
      tier30: pricing.pricingTiers?.find(t => t.duration === 30)?.price ?? 0,
      tier60: pricing.pricingTiers?.find(t => t.duration === 60)?.price ?? 0,
      tier90: pricing.pricingTiers?.find(t => t.duration === 90)?.price ?? 0,
    });
  }, [pricing, reset]);

  const updatePricingMutation = useMutation({
    mutationFn: setPricingConfig,
    onSuccess: (data) => {
      toast.success("Pricing configuration updated successfully");
      queryClient.setQueryData(
        pricingQueryOptions(mentorId!).queryKey,
        data
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update pricing");
    }
  });

  const onSubmit = (data: PricingFormValues) => {
    const payload = {
      mentorId,
      pricingTiers: [
        { duration: 30 as const, price: data.tier30 },
        { duration: 60 as const, price: data.tier60 },
        { duration: 90 as const, price: data.tier90 },
      ]
    };
    updatePricingMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Session Pricing</CardTitle>
          <CardDescription>
            Set your rates for different session durations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="tier30">30 Minute Session Price (₹)</Label>
                <Input
                  id="tier30"
                  type="number"
                  min="0"
                  {...register("tier30", { valueAsNumber: true })}
                />
                {errors.tier30 && (
                  <p className="text-sm text-destructive">{errors.tier30.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier60">60 Minute Session Price (₹)</Label>
                <Input
                  id="tier60"
                  type="number"
                  min="0"
                  {...register("tier60", { valueAsNumber: true })}
                />
                {errors.tier60 && (
                  <p className="text-sm text-destructive">{errors.tier60.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tier90">90 Minute Session Price (₹)</Label>
                <Input
                  id="tier90"
                  type="number"
                  min="0"
                  {...register("tier90", { valueAsNumber: true })}
                />
                {errors.tier90 && (
                  <p className="text-sm text-destructive">{errors.tier90.message}</p>
                )}
              </div>

              {errors.root && (
                <p className="text-sm text-destructive">{errors.root.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={!isDirty || updatePricingMutation.isPending}
              >
                {updatePricingMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
