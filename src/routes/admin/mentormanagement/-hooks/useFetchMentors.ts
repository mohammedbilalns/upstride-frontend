import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMentors } from "../-services/mentormanagement.service";

export const useFetchMentors = (
	page: number,
	limit: number,
	query: string,
	status?: "pending" | "approved" | "rejected",
) => {
	return useQuery({
		queryKey: ["mentors", page, limit, query, status],
		queryFn: ({ queryKey }) => {
			const [, page, limit, query, status] = queryKey;
			return fetchMentors(
				page as string,
				limit as string,
				query as string,
				status as "pending" | "approved" | "rejected",
			);
		},
		placeholderData: keepPreviousData,
	});
};
