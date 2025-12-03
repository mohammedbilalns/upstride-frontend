
export type UserRole = "user" | "mentor" | "admin" | "superadmin";

export interface User {
	id: string;
	name: string;
	email: string;
  phone: string;
	role: UserRole;
	profilePicture?: string;
  profilePictureId?: string;
	isActive: boolean;
	isRequestedForMentoring: "pending" | "approved" | "rejected";
	interestedExpertises: string[];
	interestedSkills: string[];
	createdAt: Date;
	isBlocked?: boolean;
}


