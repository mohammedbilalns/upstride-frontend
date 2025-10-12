export type UserRole = "user" | "mentor" | "admin" | "superadmin";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	profilePicture?: string;
	isActive: boolean;
	isRequestedForMentoring: "pending" | "approved" | "rejected";
	interestedExpertises: string[];
	interestedSkills: string[];
	createdAt: Date;
	isBlocked?: boolean;
}
