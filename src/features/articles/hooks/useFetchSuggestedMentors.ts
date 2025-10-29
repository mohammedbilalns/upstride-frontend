import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSuggestedMentors } from "@/features/connnections/services/connection.service";

export const useFetchSuggestedMentors = (limit = 10) => {
	return useInfiniteQuery({
		queryKey: ["suggestedMentors"],
		queryFn: ({ pageParam = 1 }) => fetchSuggestedMentors(pageParam, limit),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.mentors?.length < limit) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,
		select: (data) => {
			return {
				pages: data.pages.map((page) => page.mentors),
				pageParams: data.pageParams,
			};
		},
	});
};
