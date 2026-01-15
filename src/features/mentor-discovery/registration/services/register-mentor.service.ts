import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { MentorDetails } from "@/shared/types/mentorDetails";
import { apiRequest } from "@/shared/utils/apiWrapper";


export function registerMentor(data: MentorDetails) {
	return apiRequest(() => api.post(API_ROUTES.MENTOR.CREATE, data))
}

export function updateMentorRegistration(data: MentorDetails) {
	return apiRequest(() => api.put(API_ROUTES.MENTOR.UPDATE, data))
}