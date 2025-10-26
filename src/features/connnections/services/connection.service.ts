import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";


export async function followMentor(mentorId: string){
	try {
		const response = await api.post(API_ROUTES.CONNECTIONS.FOLLOW, {mentorId});
		return response.data;
	} catch (error) {
		console.error("error while following mentor", error);
		throw error;
	}
} 

export async function unfollowMentor(mentorId: string){
	try {
		const response = await api.post(API_ROUTES.CONNECTIONS.UNFOLLOW, {mentorId});
		return response.data;
	} catch (error) {
		console.error("error while unfollowing mentor", error);
		throw error;
	}
}

export async function fetchFolowers(page: number, limit: number){
	try {
		const response = await api.get(API_ROUTES.CONNECTIONS.FETCH_FOLLOWERS, {params: {page, limit}});
		return response.data;
	} catch (error) {
		console.error("error while fetching followers", error);
		throw error;
	}
}

export async function fetchFollowing(page: number, limit: number){
	try {
		const response = await api.get(API_ROUTES.CONNECTIONS.FETCH_FOLLOWING, {params: {page, limit}});
		return response.data;
	} catch (error) {
		console.error("error while fetching following", error);
		throw error;
	}
}


export async function fetchRecentActivity(){
	try {
		const response = await api.get(API_ROUTES.CONNECTIONS.RECENT_ACTIVITY);
		return response.data;
	} catch (error) {
		console.error("error while fetching recent activity", error);
		throw error;
	}
}
