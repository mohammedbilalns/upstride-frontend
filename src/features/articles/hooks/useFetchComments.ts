import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "../services/comment.service";

export const useFetchComments = (
	articleId: string,
	limit: number,
	parentCommentId?: string,
	enabled: boolean = true,
) => {
	return useInfiniteQuery({
		queryKey: ["comments", articleId, parentCommentId, limit],
		queryFn: ({ pageParam = 1 }) =>
			fetchComments(articleId, pageParam, limit, parentCommentId),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.comments.length < limit) {
				return undefined;
			}

			return allPages.length + 1;
		},
		initialPageParam: 1,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		enabled: enabled && (parentCommentId ? !!parentCommentId : true),
	});
};
