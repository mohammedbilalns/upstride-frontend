import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function fetchMentors(
	page: string,
	limit: string,
	query: string,
	status?: "pending" | "approved" | "rejected",
) {
	try {
		const response = await api.get(API_ROUTES.MENTOR.FETCH, {
			params: { page, limit, query, status },
		});
		return response.data;
	} catch (error) {
		console.error("Error while fetching expertises", error);
		throw error;
	}
}

export async function approveMentor(mentorId: string) {
	try {
		const response = await api.post(API_ROUTES.MENTOR.APPROVE, { mentorId });
		return response.data;
	} catch (error) {
		console.error("Error while approving mentor", error);
		throw error;
	}
}

export async function rejectMentor(mentorId: string, rejectionReason: string) {
	try {
		const response = await api.post(API_ROUTES.MENTOR.REJECT, {
			mentorId,
			rejectionReason,
		});
		return response.data;
	} catch (err) {
		console.error("Error while rejecting mentor", err);
		throw err;
	}
}
