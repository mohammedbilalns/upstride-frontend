import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { type MentorDetails, type MentorInDashboard } from "@/shared/types/mentor";
import { type Availability } from "@/shared/types/session";
import { apiRequest } from "@/shared/utils/apiWrapper";
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";

interface MentorsResponse {
	mentors: MentorInDashboard[];
	total: number;
}

export const mentorsQueryOptions = (
	query = "",
	expertiseId = "",
	skillId = "",
	limit = 10,
) =>
	infiniteQueryOptions({
		queryKey: ["mentors", query, expertiseId, skillId],
		queryFn: ({ pageParam = 1 }) =>
			getMentors(
				pageParam.toString(),
				limit.toString(),
				query,
				expertiseId,
				skillId,
			),
		getNextPageParam: (lastPage: MentorsResponse, allPages: MentorsResponse[]) => {
			if (lastPage.mentors.length < limit) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,
	});

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

export const mentorQueryOptions = () => queryOptions({
	queryKey: ["mentor-profile", "me"],
	queryFn: getSelf,
});

export function getMentorRules() {
	return apiRequest(() => api.get<Availability>(API_ROUTES.SLOTS.GET_RULES))
}
