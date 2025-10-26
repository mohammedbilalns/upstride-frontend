export interface Activity {
	activityType: "followed_user" | "followed_you";
	userName: string;
	avatarImage: string;
	createdAt?: string;
}
