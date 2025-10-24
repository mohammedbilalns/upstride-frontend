import type { Skill } from "./skill";

type User = {
	id: string;
	name: string;
	profilePicture: string;
}

type Expertise = {
	id: string;
	name: string;
}



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
	isVerified?: boolean;
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


export type MentorInList = {
	id: string;
	bio: string;
	yearOfExperience: number;
	user: User;
	expertise: Expertise;
	skills: Skill[];
}
