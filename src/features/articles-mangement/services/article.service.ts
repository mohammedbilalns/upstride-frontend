import { notFound } from "@tanstack/react-router";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { type AxiosResponse, isAxiosError } from "axios";
import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type {
	articleCreateData,
	articleUpdatePayload,
} from "../schemas/article.schema";
import { type ArticleResponse, type ArticlesResponse } from "@/shared/types/article";
import { apiRequest } from "@/shared/utils/apiWrapper";

export const articlesQueryOptions = (
	query?: string,
	category?: string,
	tag?: string,
	sortBy?: string,
) =>
	infiniteQueryOptions({
		queryKey: ["articles", query, category, tag, sortBy],
		queryFn: ({ pageParam = 1 }) =>
			fetchArticles(pageParam, query || "", category || "", tag || "", sortBy || ""),
		getNextPageParam: (lastPage: ArticlesResponse, allPages: ArticlesResponse[]) => {
			if (lastPage.articles.length < 4) return undefined;
			return allPages.length + 1;
		},
		initialPageParam: 1,
	});

export const articleQueryOptions = (articleId: string) => queryOptions({

	queryKey: ["articles", articleId],
	queryFn: () => getArticle(articleId),
});


export async function fetchArticles(
	page = 1,
	query?: string,
	category?: string,
	tag?: string,
	sortBy?: string,
) {
	try {
		let response: AxiosResponse;
		if (category) {
			response = await api.get<ArticlesResponse>(
				API_ROUTES.ARTICLES.ARTICLES_BY_CATEGORY,
				{
					params: { page, query, category, sortBy },
				},
			);
		} else {
			response = await api.get<ArticlesResponse>(API_ROUTES.ARTICLES.ARTICLES, {
				params: { page, query, tag, sortBy },
			});
		}
		return response.data;
	} catch (error) {
		console.error("Error while fetching articles", error);
		throw error;
	}
}



export async function fetchArticle(articleId: string) {
	try {
		const response = await api.get(API_ROUTES.ARTICLES.READ(articleId));
		return response.data;
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			throw notFound();
		}
		throw error;
	}
}


export function createArticle(article: articleCreateData) {
	return apiRequest(() => api.post(API_ROUTES.ARTICLES.CREATE, article))
}

export function getArticle(articleId: string) {
	return apiRequest(() => api.get<ArticleResponse>(API_ROUTES.ARTICLES.FETCH(articleId)))
}

export function updateArticle(article: articleUpdatePayload) {
	return apiRequest(() => api.put(API_ROUTES.ARTICLES.UPDATE, article))
}

export function deleteArticle(articleId: string) {
	return apiRequest(() => api.delete(API_ROUTES.ARTICLES.DELETE(articleId)))
}

