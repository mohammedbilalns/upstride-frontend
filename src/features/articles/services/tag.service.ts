import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { Tag } from "@/shared/types/tag";

export async function fetchMostUsedTags() {
	try {
		const response = await api.get<Tag[]>(API_ROUTES.TAGS.FETCH_MOST_USED);
		return response.data;
	} catch (error) {
		console.error("Error while fetching most used tags", error);
		throw error;
	}
}
