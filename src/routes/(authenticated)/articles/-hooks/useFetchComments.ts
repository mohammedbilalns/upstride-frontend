import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "../-services/comment.service";

export const useFetchComments = (
	articleId: string,
	limit: number,
	parentCommentId?: string,
	enabled: boolean = true,
) => {
	return useInfiniteQuery({
		queryKey: ["comments", articleId, limit, parentCommentId],
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
		// enable query only  if there is no parentId or non null parentId
		enabled: enabled && (parentCommentId ? !!parentCommentId : true),
	});
};
