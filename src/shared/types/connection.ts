export interface Activity {
	id: string;
	activityType: "followed_user" | "followed_you";
	userName: string;
	avatarImage: string;
	createdAt?: string;
}
