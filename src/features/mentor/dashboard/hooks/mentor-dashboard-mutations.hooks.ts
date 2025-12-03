import { useMutation } from "@tanstack/react-query"
import { createMentorRule, deleteMentorRule, updateMentorProfile, updateMentorRule } from "../services/mentor-dashboard.service"
import type { Rule } from "@/shared/types/session"
import type { SaveMentorProfilePayload } from "@/shared/types/mentor"

export const useCreateMentorRule = () => {
  return useMutation({
    mutationFn: ({ mentorId, rule }: { mentorId: string; rule: Partial<Rule> }) => createMentorRule({ mentorId, rule }),
    onSuccess: () => {},
    onError: () => {}
  })
}

export const useUpdateMentorRule = () => {
  return useMutation({
    mutationFn: () =>  updateMentorRule(),
    onSuccess: () => {},
    onError: () => {}
  })
} 

export const useDeleteMentorRule = () => {
  return useMutation({
    mutationFn: ({mentorId, ruleId}: {mentorId: string, ruleId: string}) => deleteMentorRule(mentorId, ruleId),
    onSuccess: () => {},
    onError: () => {}
  })
}

export const useUpdateMentorProfile = () => {
  return useMutation({
    mutationFn: (saveProfilePayload:SaveMentorProfilePayload ) => updateMentorProfile(saveProfilePayload),
    onSuccess: () => {},
    onError: () => {}
  })
}

