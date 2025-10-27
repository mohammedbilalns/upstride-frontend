export interface Activity {
	id: string;
	activityType: "followed_user" | "followed_you";
	userName: string;
	avatarImage: string;
	createdAt?: string;
}

export interface Connection {
  id: string;
  connectedAt: string;
  user:{
    id: string;
    name: string;
    profilePicture: string;
  }
  mentor?:{
    id: string;
    name: string;
  }
  expertise:{
    id: string;
    name: string;
  }


}
