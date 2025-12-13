import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { type MentorDetails, type MentorInDashboard } from "@/shared/types/mentor";
import { type SessionRules } from "@/shared/types/session";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function getMentors(
	page = "1",
	limit = "3",
	query?: string,
	expertiseId?: string,
	skillId?: string,
) {
	return apiRequest(() => api.get(API_ROUTES.MENTOR.FETCH_MENTORS_FOR_USER, {
		params: {
			page,
			limit,
			query,
			expertiseId,
			skillId,
		},
	}))
}

export function getMentor(mentorId: string) {
	return apiRequest(() => api.get<MentorDetails>(API_ROUTES.MENTOR.FETCH_SINGLE(mentorId)))
}

export function getActiveExpertisesAndSkills() {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.ACTIVE))
}

export function getSelf() {
	return apiRequest(() => api.get<MentorInDashboard>(API_ROUTES.MENTOR.GETME))
}

export function getMentorRules() {
	return apiRequest(() => api.get<SessionRules>(API_ROUTES.SLOTS.GET_RULES))
}

