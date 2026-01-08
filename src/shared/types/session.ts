export interface Slot {
  id: string;
  mentorId: string;
  startAt: string; // ISO Date
  endAt: string; // ISO Date
  status: "OPEN" | "RESERVED" | "FULL" | "STARTED" | "COMPLETED" | "CANCELLED";
  price: number;
  currency: string;
  description?: string;
}

import type { User } from './user';
import type { PaymentDetails } from './payment';

export interface Booking {
  id: string;
  slotId: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED" | "COMPLETED";
  paymentId?: string;
  rescheduleRequest?: {
    requestedSlotId: string;
    reason?: string;
    isStudentRequest: boolean;
    status: "PENDING" | "REJECTED" | "APPROVED";
    createdAt: string;
  };
  createdAt: string;
  slot?: Slot; // Populated
  userDetails?: User;
  mentorDetails?: User;
  paymentDetails?: PaymentDetails;
}

export interface Availability {
  id: string;
  mentorId: string;
  recurringRules: RecurringRule[];
  price: number;
}

export interface RecurringRule {
  ruleId: string;
  weekDay: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotDuration: number;
  isActive: boolean;
  price: number;
}

export interface AddRecurringRuleDto {
  rule: {
    weekDay: number;
    startTime: string;
    endTime: string;
    slotDuration: 60 | 90 | 120 | 180;
    price: number;
  }
}
