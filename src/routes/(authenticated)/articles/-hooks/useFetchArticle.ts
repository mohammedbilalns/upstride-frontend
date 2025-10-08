import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchArticle } from "../-services/article.service";

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
