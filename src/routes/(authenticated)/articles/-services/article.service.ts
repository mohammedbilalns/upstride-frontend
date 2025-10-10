import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";
import type { articleCreateData } from "../-validations/article.validations";

export async function fetchArticles(
	page: number,
	query: string,
	category?: string,
	tag?: string, 
	sortBy?: string
) {

	try {
		let response 
		if(category){
			response = await api.get(API_ROUTES.ARTICLES.ARTICLES_BY_CATEGORY, {
				params: { page, query, category, sortBy },
			});
		}else {
			response = await api.get(API_ROUTES.ARTICLES.ARTICLES, {
				params: { page, query, tag, sortBy },
			});
		}
		return response.data;

	} catch (error) {
		console.error("Error while fetching articles", error);
		throw error;
	}
}

export async function createArticle(article: articleCreateData) {
	try {
		const response = await api.post(API_ROUTES.ARTICLES.CREATE, article);
		return response.data;
	} catch (error) {
		console.error("Error while creating article", error);
		throw error;
	}
}

export async function updateArticle(articleId: string, article: any) {
	try {
		const response = await api.put(
			API_ROUTES.ARTICLES.UPDATE(articleId),
			article,
		);
		return response.data;
	} catch (error) {
		console.error("Error while updating article", error);
		throw error;
	}
}

export async function deleteArticle(articleId: string) {
	try {
		const response = await api.delete(API_ROUTES.ARTICLES.DELETE(articleId));
		return response.data;
	} catch (error) {
		console.error("Error while deleting article", error);
		throw error;
	}
}

export async function fetchArticle(articleId: string) {
	try {
		const response = await api.get(API_ROUTES.ARTICLES.READ(articleId));
		return response.data;
	} catch (error) {
		console.error("Error while fetching article", error);
		throw error;
	}
}
