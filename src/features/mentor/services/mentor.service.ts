import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import  { type MentorDetails, type MentorInDashboard } from "@/shared/types/mentor";
import { type SessionRules } from "@/shared/types/session";

export async function getMentors(
	page = "1",
	limit = "3",
	query?: string,
	expertiseId?: string,
	skillId?: string,
) {
	try {
		const response = await api.get(API_ROUTES.MENTOR.FETCH_MENTORS_FOR_USER, {
			params: {
				page,
				limit,
				query,
				expertiseId,
				skillId,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching mentors for user", error);
		throw error;
	}
}

export async function getMentor(mentorId: string) {
  try{
    const response = await api.get<MentorDetails>(API_ROUTES.MENTOR.FETCH_SINGLE(mentorId));
    return response.data;
  }catch(error){
    console.error("Error fetching mentor", error);
    throw error 
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

export async function getSelf(){
  try{
    const response = await api.get<MentorInDashboard>(API_ROUTES.MENTOR.GETME);
    return response.data;

  }catch(error){
    console.error("Error fetching self details  ", error)
    throw error 
  }
}


export async function getMentorRules(mentorId: string){

  try {
    const response = await api.get<SessionRules>(API_ROUTES.SLOTS.GET_RULES(mentorId))
    return response.data
    
  } catch (error) {
    console.error("Error fetching mentor rules", error);
    throw error 
    
  }
}
