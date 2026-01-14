import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { Tag } from "@/shared/types/tag";
import { apiRequest } from "@/shared/utils/apiWrapper";


export function fetchMostUsedTags() {
	return apiRequest(() => api.get<Tag[]>(API_ROUTES.TAGS.FETCH_MOST_USED))
}