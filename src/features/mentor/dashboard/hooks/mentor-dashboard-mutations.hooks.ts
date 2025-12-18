import { useMutation } from "@tanstack/react-query"
import { addRecurringRule, deleteMentorRule, disableRecurringRule, enableRecurringRule, updateMentorProfile, updateRecurringRule } from "../services/mentor-dashboard.service"
import type { AddRecurringRulePayload, Rule } from "@/shared/types/session"
import type { SaveMentorProfilePayload } from "@/shared/types/mentor"
import { queryClient } from "@/app/router/routerConfig"
import type { ApiError } from "@/shared/types"
import { toast } from "sonner"

function invalidateMentorRule(mentorId: string) {
  queryClient.invalidateQueries({
    queryKey: ["mentorRules", mentorId]
  })
}

function handlMutationError(error: ApiError, message: string) {
  const errorMessage = error?.response?.data?.message ?? message
  toast.error(errorMessage)
}

export const useAddRecurringRule = (mentorId: string) => {
  return useMutation({
    mutationFn: (rule: AddRecurringRulePayload) => addRecurringRule(rule),
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
    mutationFn: ({ ruleId, updatedRule }: { ruleId: string, updatedRule: Partial<Rule> | { startTime: string, endTime: string, slotDuration: number, weekDay: number } }) => updateRecurringRule(ruleId, updatedRule),
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
    mutationFn: (ruleId: string) => deleteMentorRule(ruleId),
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
    onSuccess: () => {},
    onError: (error: ApiError) => {
      handlMutationError(error, "Faild to update profile")
    }
  })
}
