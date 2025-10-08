import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../-services/article.service";

export const useFetchArticles = (
	page: number,
	limit: number,
	query: string,
) => {
	return useQuery({
		queryKey: ["articles", page, limit, query],
		queryFn: ({ queryKey }) => {
			const [, page, limit, query] = queryKey;
			return fetchArticles(page as string, limit as string, query as string);
		},
		placeholderData: keepPreviousData,
	});
};
