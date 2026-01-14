import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addRecurringRule,
  updateRecurringRule,
  enableRecurringRule,
  disableRecurringRule,
  deleteRecurringRule,
  createCustomSlot,
  enableSlot,
  cancelSlot,
  deleteSlot,
  updateMentorProfile,
} from "../services/mentor-dashboard.service";
import { toast } from "sonner";
import type { RecurringRule } from "@/shared/types/session";
import type { SaveMentorProfilePayload } from "@/shared/types/mentor";

export function useAddRecurringRule(mentorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      rule,
    }: {
      rule: {
        weekDay: number;
        startTime: string;
        endTime: string;
        slotDuration: number;
      };
    }) => addRecurringRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-rules", mentorId] });
      queryClient.invalidateQueries({ queryKey: ["mentor-slots", mentorId] });
      toast.success("Recurring rule created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create recurring rule");
    },
  });
}

export function useUpdateRecurringRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ruleId,
      updatedRule,
      invalidateExisting,
    }: {
      ruleId: string;
      updatedRule:
      | Partial<RecurringRule>
      | {
        startTime: string;
        endTime: string;
        slotDuration: number;
        weekDay: number;
      };
      invalidateExisting?: boolean;
    }) => updateRecurringRule(ruleId, updatedRule, invalidateExisting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-rules"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Rule updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update rule");
    },
  });
}

export function useEnableRecurringRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => enableRecurringRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-rules"] });
      toast.success("Rule enabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enable rule");
    },
  });
}

export function useDisableRecurringRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => disableRecurringRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-rules"] });
      toast.success("Rule disabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to disable rule");
    },
  });
}

export function useDeleteRecurringRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => deleteRecurringRule(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-rules"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Rule deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete rule");
    },
  });
}

export function useCreateCustomSlot(mentorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      mentorId: string;
      startAt: string;
      endAt: string;
      slotDuration: number;
    }) => createCustomSlot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-slots", mentorId] });
      toast.success("Custom slot created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create custom slot");
    },
  });
}

export function useEnableSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => enableSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Slot enabled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enable slot");
    },
  });
}

export function useCancelSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => cancelSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Slot cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel slot");
    },
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => deleteSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
      toast.success("Slot deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete slot");
    },
  });
}

export function useUpdateMentorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (saveProfilePayload: SaveMentorProfilePayload) =>
      updateMentorProfile(saveProfilePayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-profile"] });
      toast.success("Mentor profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update mentor profile");
    },
  });
}

// Backward compatibility exports (old naming convention)
export const useDeleteMentorRule = useDeleteRecurringRule;
export const useUpdateMentorRule = useUpdateRecurringRule;
export const useEnableMentorRule = useEnableRecurringRule;
export const useDisableMentorRule = useDisableRecurringRule;
