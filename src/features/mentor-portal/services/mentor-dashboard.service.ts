import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { RecurringRule } from "@/shared/types/session";

export function addRecurringRule(rule: {
  weekDay: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}) {
  return api.post(API_ROUTES.SLOTS.ADD_RECURRING_RULE, rule);
}

export function updateRecurringRule(
  ruleId: string,
  updatedRule: Partial<RecurringRule> | {
    startTime: string;
    endTime: string;
    slotDuration: number;
    weekDay: number;
  },
  invalidateExisting?: boolean,
) {
  return api.patch(API_ROUTES.SLOTS.UPDATE_RECURRING_RULE(ruleId), {
    ...updatedRule,
    invalidateExisting,
  });
}

export function enableRecurringRule(ruleId: string) {
  return api.patch(API_ROUTES.SLOTS.ENABLE_RECURRING_RULE(ruleId));
}

export function disableRecurringRule(ruleId: string) {
  return api.patch(API_ROUTES.SLOTS.DISABLE_RECURRING_RULE(ruleId));
}

export function deleteRecurringRule(payload: { ruleId: string; deleteSlots: boolean }) {
  return api.delete(`${API_ROUTES.SLOTS.DELETE_RECURRING_RULE(payload.ruleId)}?deleteSlots=${payload.deleteSlots}`);
}

export function createCustomSlot(payload: {
  mentorId: string;
  startAt: string;
  endAt: string;
  slotDuration: number;
}) {
  return api.post(API_ROUTES.SLOTS.CREATE_CUSTOM_SLOT, payload);
}

export function enableSlot(slotId: string) {
  return api.patch(API_ROUTES.SLOTS.ENABLE_SLOT(slotId));
}

export function cancelSlot(slotId: string) {
  return api.patch(API_ROUTES.SLOTS.CANCEL_SLOT(slotId));
}

export function deleteSlot(slotId: string) {
  return api.delete(API_ROUTES.SLOTS.DELETE_SLOT(slotId));
}

export function updateMentorProfile(saveProfilePayload: import("@/shared/types/mentor").SaveMentorProfilePayload) {
  return api.put(API_ROUTES.MENTOR.UPDATE, saveProfilePayload);
}
