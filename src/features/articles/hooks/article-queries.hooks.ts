import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchArticle, fetchArticles } from "../services/article.service";
import { fetchMostUsedTags } from "../services/tag.service";
import { fetchComments } from "../services/comment.service";

export const useFetchArticle = (articleId: string) => {
	return useQuery({
		queryKey: ["article", articleId],
		queryFn: ({ queryKey }) => {
			const [, articleId] = queryKey;
			return fetchArticle(articleId as string);
		},
		placeholderData: keepPreviousData,
	});
};

export const useFetchArticles = () => {
	return useQuery({
		queryKey: ["articles"],
		queryFn: () => fetchArticles(1),
		placeholderData: keepPreviousData,
		select: (data) => data.articles,
	});
};

export const useFetchMostUsedTags = () => {
	return useQuery({
		queryKey: ["mostUsedTags"],
		queryFn: async () => {
			return await fetchMostUsedTags();
		},
	});
};

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
