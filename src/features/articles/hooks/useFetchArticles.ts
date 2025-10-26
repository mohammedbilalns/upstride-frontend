import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../services/article.service";

export const useFetchArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => fetchArticles(1, "", "", "", ""),
    placeholderData: keepPreviousData,
    select: (data) => data.articles,
  });
}
