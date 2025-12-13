import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function fetchExpertises(page: string, limit: string, query: string) {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.FETCH, {
		params: { page, limit, query },
	}))
}

export function fetchExpertisesForAdmin(page: string, limit: string, query: string) {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.FETCH_BY_ADMIN, {
		params: { page, limit, query },
	}))
}

export function fetchSkills(expertiseId: string) {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.FETCH_SKILLS(expertiseId)))
}

export function fetchSkillsForAdmin(expertiseId: string) {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.FETCH_SKILLS_BY_ADMIN(expertiseId)))
}


export function createSkill(name: string, expertiseId: string) {
	return apiRequest(() => api.post(API_ROUTES.EXPERTISE.CREATE_SKILL(expertiseId), {
		params: { name },
	}))
}

export function createExpertise(name: string, description: string, skills: string[]) {
	return apiRequest(() => api.post(API_ROUTES.EXPERTISE.CREATE, {
		params: { name, description, skills },
	}))
}

export function updateExpertise(id: string, name: string, description: string) {
	return apiRequest(() => api.put(API_ROUTES.EXPERTISE.UPDATE(id), {
		params: { name, description },
	}))
}

export function verifyExpertise(id: string) {
	return apiRequest(() => api.put(API_ROUTES.EXPERTISE.VERIFY(id)))
}

export function updateSkill(id: string) {
	return apiRequest(() => api.put(API_ROUTES.EXPERTISE.UPDATE_SKILL(id)))
}

export function verifySkill(id: string) {
	return apiRequest(() => api.put(API_ROUTES.EXPERTISE.VERIFY_SKILL(id)))
}
