import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function reactResource(
	resourceId: string,
	reaction: "like" | "dislike",
	resourceType: "article" | "comment",
) {
	try {
		const response = await api.post(API_ROUTES.REACT.REACT_RESOURCE, {
			resourceId,
			reaction,
			resourceType,
		});
		return response.data;
	} catch (error) {
		console.error("error while liking resource", error);
		throw error;
	}
}

export async function getReactions(
	resourceId: string,
	page: number,
	limit: number,
) {
	try {
		const response = await api.get(API_ROUTES.REACT.GET_REACTIONS, {
			params: { resourceId, page, limit },
		});
		return response.data;
	} catch (error) {
		console.error("error while fetching reactions", error);
		throw error;
	}
}
