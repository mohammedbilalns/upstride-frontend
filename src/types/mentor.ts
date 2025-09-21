import type { Skill } from "./skill";

export type Mentor = {
  id: string;
  bio: string;
  currentRole: string;
  organisation: string;
  yearsOfExperience: number;
  educationalQualifications: string[];
  personalWebsite?: string;
  resumeId: string;
  isPending: boolean;
  isActive: boolean;
  isRejected: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  expertise: {
    id: string;
    name: string;
  };
  skills: Omit<Skill, "isVerified">[];
  createdAt: Date;
};
