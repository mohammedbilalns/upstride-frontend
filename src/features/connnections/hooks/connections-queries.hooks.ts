import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchFollowing, fetchFollowers, fetchRecentActivity } from "../services/connection.service";

export function useFetchFollowers() {
	const limit = 10;
	return useInfiniteQuery({
		queryKey: ["followers"],
		queryFn: ({ pageParam = 1 }) => fetchFollowers(pageParam, limit),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.length < limit) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,
	});
}

export function useFetchFollowing() {
	const limit = 10;

	return useInfiniteQuery({
		queryKey: ["following"],
		queryFn: ({ pageParam = 1 }) => fetchFollowing(pageParam, limit),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.length < limit) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,

	});
}

export function useFetchRecentActivity() {
	return useQuery({
		queryKey: ["recentActivity"],
		queryFn: () => fetchRecentActivity(),
	});
}
