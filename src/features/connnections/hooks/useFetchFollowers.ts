import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFolowers } from "../services/connection.service";

export function useFetchFollowers() {
	const limit = 10;
	return useInfiniteQuery({
		queryKey: ["followers"],
		queryFn: ({ pageParam = 1 }) => fetchFolowers(pageParam, limit),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.length < limit) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,
	});
}
