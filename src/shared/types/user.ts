
export type UserRole = "user" | "mentor" | "admin" | "superadmin";

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	mentorId?: string;
	profilePicture?: string;
	profilePictureId?: string;
	isActive: boolean;
	isRequestedForMentoring: "pending" | "approved" | "rejected";
	interestedExpertises: string[] | { _id: string; name: string }[];
	interestedSkills: string[] | { _id: string; name: string }[];
	createdAt: Date;
	isBlocked?: boolean;
}


