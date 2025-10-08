export type Expertise = {
	id: string;
	name: string;
	description: string;
	isVerified: boolean;
};

export type ExpertiseArea = {
	id: string;
	name: string;
	description: string;
};

export type Topic = {
	id: string;
	name: string;
	expertiseAreaId: string;
};
