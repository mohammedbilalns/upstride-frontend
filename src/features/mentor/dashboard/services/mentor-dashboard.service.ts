import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { SaveMentorProfilePayload } from "@/shared/types/mentor";
import type { AddRecurringRulePayload, Rule } from "@/shared/types/session";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function updateRecurringRule(ruleId: string, updatedRule: Partial<Rule>) {
  return apiRequest(() => api.patch(API_ROUTES.SLOTS.UPDATE_RECURRING_RULE(ruleId), updatedRule))
}

export function addRecurringRule(rule: AddRecurringRulePayload) {
  return apiRequest(() => api.post(API_ROUTES.SLOTS.ADD_RECURRING_RULE, rule))
}

export function deleteMentorRule(ruleId: string) {
  return apiRequest(() => api.delete(API_ROUTES.SLOTS.DELETE_RECURRING_RULE(ruleId)))
}

export function disableRecurringRule(ruleId: string) {
  return apiRequest(() => api.patch(API_ROUTES.SLOTS.DISABLE_RECURRING_RULE(ruleId)))
}

export function updateMentorProfile(saveProfilePayload: SaveMentorProfilePayload) {
  return apiRequest(() => api.put(API_ROUTES.MENTOR.UPDATE, saveProfilePayload))
}

