export interface Rule {
  ruleId: string;
  weekDay: number;
  startTime: Number;
  endTime: Number;
  slotDuration: 60 | 90 | 120 | 180;
  isActive?: boolean;
}

export interface SessionRules {
  id: string;
  mentorId: string;
  recurringRules: Rule[];
  createdAt: Date;
}

export interface AddRecurringRulePayload {
  rule: Partial<Omit<Rule, "startTime" | "endTime">
    & { startTime: string, endTime: string }>
} 
