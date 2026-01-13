import { useMutation } from "@tanstack/react-query"
import { addRecurringRule, deleteMentorRule, disableRecurringRule, enableRecurringRule, updateMentorProfile, updateRecurringRule, createCustomSlot, cancelSlot, deleteSlot } from "../services/mentor-dashboard.service"
import type { AddRecurringRuleDto, RecurringRule } from "@/shared/types/session"
import type { SaveMentorProfilePayload } from "@/shared/types/mentor"
import { queryClient } from "@/app/router/routerConfig"
import type { ApiError } from "@/shared/types"
import { toast } from "sonner"

function invalidateMentorRule(mentorId: string) {
  return queryClient.invalidateQueries({
    queryKey: ["mentorRules", mentorId]
  })
}

function handleMutationError(error: ApiError, message: string) {
  const responseData = error?.response?.data;

  if (responseData?.errors && Array.isArray(responseData.errors)) {
    // Show the first validation error
    const firstError = responseData.errors[0];
    toast.error(`${firstError.path}: ${firstError.message}`);
    return;
  }

  const errorMessage = responseData?.message ?? message
  toast.error(errorMessage)
}

export const useAddRecurringRule = (mentorId: string) => {
  return useMutation({
    mutationFn: (rule: AddRecurringRuleDto) => addRecurringRule(rule),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue creating the rule. Please try again.")
    }
  })
}

export const useUpdateMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: ({ ruleId, updatedRule, invalidateExisting }: { ruleId: string, updatedRule: Partial<RecurringRule> | { startTime: string, endTime: string, slotDuration: number, weekDay: number, price?: number }, invalidateExisting?: boolean }) => updateRecurringRule(ruleId, updatedRule, invalidateExisting),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Availability rule updated successfully.")
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue updating the rule. Please try again.")
    }
  })
}

export const useDeleteMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: ({ ruleId, deleteSlots }: { ruleId: string, deleteSlots?: boolean }) => deleteMentorRule(ruleId, deleteSlots),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Availability rule deleted successfully.")
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue deleting the rule. Please try again.")
    }
  })
}

export const useDisableMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: (ruleId: string) => disableRecurringRule(ruleId),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Availability rule has been disabled.")
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue disabling the rule. Please try again.")
    }
  })
}

export const useEnableMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: (ruleId: string) => enableRecurringRule(ruleId),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Availability rule has been enabled.")
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue enabling the rule. Please try again.")
    }
  })
}

export const useUpdateMentorProfile = () => {
  return useMutation({
    mutationFn: (saveProfilePayload: SaveMentorProfilePayload) => updateMentorProfile(saveProfilePayload),
    onSuccess: () => { },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue updating the profile. Please try again.")
    }
  })
}

export const useCreateCustomSlot = (mentorId: string) => {
  return useMutation({
    mutationFn: (payload: { mentorId: string, startAt: string, endAt: string, slotDuration: number, price: number }) => createCustomSlot(payload),
    onSuccess: async () => {
      await Promise.all([
        invalidateMentorRule(mentorId),
        // Also invalidate slots query
        queryClient.invalidateQueries({
          queryKey: ["slots", mentorId]
        })
      ]);

      toast.success("Custom availability slot added successfully.")
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue creating the custom slot. Please try again.")
    }
  })
}

export const useCancelSlot = (mentorId: string) => {
  return useMutation({
    mutationFn: (slotId: string) => cancelSlot(slotId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["slots", mentorId]
      });
      toast.success("Slot has been disabled.");
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue disabling the slot. Please try again.");
    }
  })
}


export const useDeleteSlot = (mentorId: string) => {
  return useMutation({
    mutationFn: (slotId: string) => deleteSlot(slotId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["slots", mentorId]
      });
      toast.success("Slot has been deleted.");
    },
    onError: (error: ApiError) => {
      handleMutationError(error, "We encountered an issue deleting the slot. Please try again.");
    }
  })
}
