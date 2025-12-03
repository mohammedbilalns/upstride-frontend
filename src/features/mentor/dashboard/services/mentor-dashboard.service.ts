import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { SaveMentorProfilePayload } from "@/shared/types/mentor";
import type { Rule } from "@/shared/types/session";


export async function updateMentorRule(){
  try {
    //TODO: perform api request 

    
  } catch (error) {
    console.error("Failed to update mentor rule:", error);
    throw error;
  }
}

export async function createMentorRule({mentorId, rule}: {mentorId: string, rule: Partial<Rule>}){
  try {
    //TODO: perform api request
    
  } catch (error) {
    console.error("Failed to create mentor rule:", error);
    throw error;
  }
}

export async function deleteMentorRule(mentorId: string, ruleId: string){
  try{
    //TODO: perform api request

  }catch(error){
    console.error("Failed to delete mentor rule:", error);
    throw error
  }
}


export async function updateMentorProfile(saveProfilePayload: SaveMentorProfilePayload){
  try {
    const response = await api.put(API_ROUTES.MENTOR.UPDATE, saveProfilePayload)
    return response.data

  } catch (error) {

    console.error("Failed to update mentor profile:", error);
    throw error
    
  }
} 
