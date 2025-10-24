import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function getMentorsForUser(page: string, limit: string, query: string, expertiseId: string, skillId: string) {
	try {
		const response = await api.get(API_ROUTES.MENTOR.FETCH_MENTORS_FOR_USER,{
			params: {
				page,
				limit,
				query,
				expertiseId,
				skillId,
			}
		})
		return response.data 
	} catch (error) {
		console.error("Error fetching mentors for user", error);
		throw error;
	}
}

export async function getMentorDetails(id: string) {
	try {
		const response = await api.get(API_ROUTES.MENTOR.FETCH_MENTOR_DETAILS, {
			params: {
				mentorId: id,
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching mentor details", error);
		throw error;
	}
}


export async function getActiveExpertisesAndSkills() {
	try {
		const response = await api.get(API_ROUTES.EXPERTISE.ACTIVE);
		return response.data;
	} catch (error) {
		console.error("Error fetching active expertises and skills", error);
		throw error;
	}
}
