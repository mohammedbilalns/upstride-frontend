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

function handlMutationError(error: ApiError, message: string) {
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
      handlMutationError(error, "Faild to create rule")
    }
  })
}

export const useUpdateMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: ({ ruleId, updatedRule, invalidateExisting }: { ruleId: string, updatedRule: Partial<RecurringRule> | { startTime: string, endTime: string, slotDuration: number, weekDay: number, price?: number }, invalidateExisting?: boolean }) => updateRecurringRule(ruleId, updatedRule, invalidateExisting),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Rule updated successfully")
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Faild to update rule")
    }
  })
}

export const useDeleteMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: ({ ruleId, deleteSlots }: { ruleId: string, deleteSlots?: boolean }) => deleteMentorRule(ruleId, deleteSlots),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Rule deleted successfully")
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Faild to delete rule")
    }
  })
}

export const useDisableMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: (ruleId: string) => disableRecurringRule(ruleId),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Rule disabled successfully")
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Faild to disable rule")
    }
  })
}

export const useEnableMentorRule = (mentorId: string) => {
  return useMutation({
    mutationFn: (ruleId: string) => enableRecurringRule(ruleId),
    onSuccess: () => {
      invalidateMentorRule(mentorId)
      toast.success("Rule enabled successfully")
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Faild to enable rule")
    }
  })
}

export const useUpdateMentorProfile = () => {
  return useMutation({
    mutationFn: (saveProfilePayload: SaveMentorProfilePayload) => updateMentorProfile(saveProfilePayload),
    onSuccess: () => { },
    onError: (error: ApiError) => {
      handlMutationError(error, "Faild to update profile")
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
      toast.success("Slot added successfully")
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Failed to create custom slot")
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
      toast.success("Slot disabled successfully");
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Failed to disable slot");
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
      toast.success("Slot deleted successfully");
    },
    onError: (error: ApiError) => {
      handlMutationError(error, "Failed to delete slot");
    }
  })
}
