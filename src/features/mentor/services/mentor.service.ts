import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { type MentorDetails, type MentorInDashboard } from "@/shared/types/mentor";
import { type SessionRules } from "@/shared/types/session";
import { apiRequest } from "@/shared/utils/apiWrapper";


/**
 * Fetches a paginated list of mentors available to the user.
 * Supports search and filtering by expertise and skill.
 *
 * @param page - Page number for pagination (default: "1").
 * @param limit - Number of mentors per page (default: "3").
 * @param query - Optional search query (name, title, etc.).
 * @param expertiseId - Optional expertise filter ID.
 * @param skillId - Optional skill filter ID.
 * @returns Paginated list of mentors.
 */
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

/**
 * Fetches detailed information of a specific mentor.
 *
 * @param mentorId - Unique identifier of the mentor.
 * @returns Mentor profile details.
 */
export function getMentor(mentorId: string) {
	return apiRequest(() => api.get<MentorDetails>(API_ROUTES.MENTOR.FETCH_SINGLE(mentorId)))
}

/**
 * Fetches all active expertises and skills.
 * Used for filtering mentors.
 *
 * @returns List of active expertises and skills.
 */
export function getActiveExpertisesAndSkills() {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.ACTIVE))
}

/**
 * Fetches the authenticated mentor's own dashboard data.
 *
 * @returns Mentor dashboard profile information.
 */
export function getSelf() {
	return apiRequest(() => api.get<MentorInDashboard>(API_ROUTES.MENTOR.GETME))
}

/**
 * Fetches session availability rules for the authenticated mentor.
 *
 * @returns Mentor session rules configuration.
 */
export function getMentorRules() {
	return apiRequest(() => api.get<SessionRules>(API_ROUTES.SLOTS.GET_RULES))
}

