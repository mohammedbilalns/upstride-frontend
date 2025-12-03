import type { User } from "./user";

type UserData = Pick<User,"id" | "name"|"profilePicture">
type MentorData = Omit<UserData, "id"> & {
  _id: string;
  email: string;
}

export interface Connection {
	id: string;
	connectedAt: string;
	user: UserData;
	mentor?: {
		id: string;
		name: string;
	};
	expertise: {
		id: string;
		name: string;
	};
}

export type  RecentActivityResponse = Array<{
	id: string;
	activityType: "followed_user" | "followed_you";
	userName: string;
	avatarImage: string;
	createdAt?: string;
}>

export type  fetchFollowersResponse = Array<{
  id: string;
  mentorId: string;
  followerId: MentorData;
}>

export type fetchFollowingResponse = Array<{
  id: string;
  mentorId:{
    _id: string;
    userId:MentorData;
    bio: string;
    currentRole: string;
    yearsOfExperience: number;
    expertiseId:{
      name: string;
    };
    skillIds: Array<{
      name: string
    }>
    followerId: string;
  }
}>
