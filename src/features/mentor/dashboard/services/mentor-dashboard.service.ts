import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { SaveMentorProfilePayload } from "@/shared/types/mentor";
import type { AddRecurringRuleDto, RecurringRule } from "@/shared/types/session";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function updateRecurringRule(ruleId: string, updatedRule: Partial<RecurringRule> | { startTime: string, endTime: string, slotDuration: number, weekDay: number, price?: number }, invalidateExisting?: boolean) {
  return apiRequest(() => api.patch(API_ROUTES.SLOTS.UPDATE_RECURRING_RULE(ruleId), { ...updatedRule, invalidateExisting }))
}

export function addRecurringRule(rule: AddRecurringRuleDto) {
  return apiRequest(() => api.post(API_ROUTES.SLOTS.ADD_RECURRING_RULE, rule))
}

export function deleteMentorRule(ruleId: string, deleteSlots?: boolean) {
  const url = deleteSlots
    ? `${API_ROUTES.SLOTS.DELETE_RECURRING_RULE(ruleId)}?deleteSlots=true`
    : API_ROUTES.SLOTS.DELETE_RECURRING_RULE(ruleId);
  return apiRequest(() => api.delete(url))
}

export function disableRecurringRule(ruleId: string) {
  return apiRequest(() => api.patch(API_ROUTES.SLOTS.DISABLE_RECURRING_RULE(ruleId)))
}

export function enableRecurringRule(ruleId: string) {
  return apiRequest(() => api.patch(API_ROUTES.SLOTS.ENABLE_RECURRING_RULE(ruleId)))
}

export function updateMentorProfile(saveProfilePayload: SaveMentorProfilePayload) {
  return apiRequest(() => api.put(API_ROUTES.MENTOR.UPDATE, saveProfilePayload))
}

export function createCustomSlot(payload: { mentorId: string, startAt: string, endAt: string, slotDuration: number, price: number }) {
  return apiRequest(() => api.post(API_ROUTES.SLOTS.CREATE_CUSTOM_SLOT, payload))
}

export function cancelSlot(slotId: string) {
  return apiRequest(() => api.post(API_ROUTES.SLOTS.CANCEL_SLOT(slotId)))
}

export function deleteSlot(slotId: string) {
  return apiRequest(() => api.delete(API_ROUTES.SLOTS.DELETE_SLOT(slotId)))
}

