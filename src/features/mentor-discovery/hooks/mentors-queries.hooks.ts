import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchMutualConnections, fetchSuggestedMentors } from "@/features/connnections/services/connection.service";
import { getActiveExpertisesAndSkills} from "../services/mentor.service";

export function useFetchMutualMentors() {
	return useQuery({
		queryKey: ["mutualMentors"],
		queryFn: () => fetchMutualConnections(),
	});
}

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

export const useFetchActiveExpertisesAndSkills = () => {
	return useQuery({
		queryKey: ["activeExpertisesAndSkills"],
		queryFn: getActiveExpertisesAndSkills,
	})
};


