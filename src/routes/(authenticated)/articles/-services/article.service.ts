import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";

export async function fetchArticles(page: string, limit: string, query: string) {
  try {
    const response = await api.get(API_ROUTES.ARTICLES.ARTICLES, {
      params: { page, limit, query },
    });
    return response.data;
  } catch (error) {
    console.error("Error while fetching articles", error);
    throw error;
  }
}

export async function createArticle(article: any) {
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
      article
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
