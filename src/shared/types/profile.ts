interface Expertise {
	_id: string;
	name: string;
}
interface Skill {
	_id: string;
	name: string;
}

export interface ProfileData {
	id: string;
	name: string;
	email: string;
	phone: string;
	profilePicture?: string;
	interestedExpertises: Expertise[];
	role: "user" | "mentor";
	interestedSkills: Skill[];
}

export interface ProfileFormPayload {
  bio?: string;
  currentRole?: string;
  organisation?: string; 
  educationalQualificationsText: string;
  skills?: string[];
  personalStatement?: string;
  newSkills?: string[];
  personalWebsite?: string;
}
