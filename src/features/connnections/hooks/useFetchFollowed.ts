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
						(following: {
							mentorId: {
								_id: string;
								userId: string;
								expertiseId: string;
								currentRole: string;
								yearsOfExperience: number;
								bio: string;
								skillIds: string[];
							};
							id: string;
							createdAt: Date;
						}) => {
							const { mentorId } = following;
							return {
								id: mentorId._id,
								user: mentorId.userId,
								expertise: mentorId.expertiseId,
								skills: mentorId.skillIds,
								bio: mentorId.bio,
								currentRole: mentorId.currentRole,
								yearsOfExperience: mentorId.yearsOfExperience,
								connectionId: following.id,
								createdAt: following.createdAt,
							};
						},
					),
				),
			};
		},
	});
}
