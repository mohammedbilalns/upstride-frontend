import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchRecentActivity } from "../services/connection.service";

import { followersQueryOptions } from "../services/connection.service";

export function useFetchFollowers() {
	return useInfiniteQuery(followersQueryOptions());
}

import { followingQueryOptions } from "../services/connection.service";

export function useFetchFollowing() {
	return useInfiniteQuery(followingQueryOptions());
}

export function useFetchRecentActivity() {
	return useQuery({
		queryKey: ["recentActivity"],
		queryFn: () => fetchRecentActivity(),
	});
}
