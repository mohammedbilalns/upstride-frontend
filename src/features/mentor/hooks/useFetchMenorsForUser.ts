import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMentorsForUser } from "../services/mentor.service";

export const useFetchMentorsForUser = (
	page: number,
	limit: number,
	query?: string,
	expertiseId?: string,
	skillId?: string,
) => {
	return useQuery({
		queryKey: ["mentors", page, limit, query, expertiseId, skillId],
		queryFn: ({ queryKey }) => {
			const [, page, limit, query, expertiseId, skillId] = queryKey;
			return getMentorsForUser(
				page as string,
				limit as string,
				query as string,
				expertiseId as string,
				skillId as string,
			);
		},
		placeholderData: keepPreviousData,
	});
};
