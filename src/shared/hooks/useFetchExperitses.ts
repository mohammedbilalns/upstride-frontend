import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchExpertises } from "../../features/admin/expertise-mangement/services/expertise-management.service";

/**
 * Fetches paginated expertises data with optional search query.
 *
 * @param page - Current page number
 * @param limit - Items per page
 * @param query - Optional search query
 */
export const useFetchExpertises = (
	page: string,
	limit: string,
	query: string,
) => {
	return useQuery({
		queryKey: ["expertises", page, limit, query],
    queryFn: () => fetchExpertises(page, limit, query),
		placeholderData: keepPreviousData,
	});
};
