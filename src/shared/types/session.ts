export interface Rule {
  ruleId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive?: boolean;
}

export interface SessionRules {
  id: string;
  mentorId: string;
  recurringRules: Rule[];
  //  price: number;
  createdAt: Date;
}
