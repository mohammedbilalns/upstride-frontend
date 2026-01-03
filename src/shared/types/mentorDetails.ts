import type { CloudinaryResponse } from "./cloudinaryResponse";

export interface MentorDetails {
	bio: string;
	currentRole: string;
	organisation: string;
	yearsOfExperience: number;
	educationalQualifications: string[];
	personalWebsite?: string;
	expertise: string;
	skills: string[];
	resume: CloudinaryResponse;
	termsAccepted: boolean;
}


export type MentorProfileUpdatePayload = MentorDetails & {
  newSkills?: string[];
}

