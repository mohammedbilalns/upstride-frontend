import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFollowing } from "../services/connection.service";

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
		select: (data) => {
			return {
				...data,
				pages: data.pages.map((page) =>
					page.map(
						(mentor: {
							_id: string;
							userId: string;
							expertiseId: string;
							skillIds: string[];
						}) => ({
							...mentor,
							id: mentor._id,
							user: mentor.userId,
							expertise: mentor.expertiseId,
							skills: mentor.skillIds,
						}),
					),
				),
			};
		},
	});
}
