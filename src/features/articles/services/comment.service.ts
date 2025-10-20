import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function fetchComments(
	articleId: string,
	page: number,
	limit: number,
	parentCommentId?: string,
) {
	try {
		const response = await api.get(API_ROUTES.COMMENT.BASE, {
			params: {
				articleId,
				page,
				limit,
				parentCommentId,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error while fetching comments", error);
		throw error;
	}
}

export async function createComment(
	articleId: string,
	content: string,
	parentCommentId?: string,
) {
	try {
		const response = await api.post(API_ROUTES.COMMENT.BASE, {
			articleId,
			content,
			parentCommentId,
		});
		return response.data;
	} catch (error) {
		console.error("Error while creating comment", error);
		throw error;
	}
}

export async function updateComment(commentId: string, content: string) {
	try {
		const response = await api.put(API_ROUTES.COMMENT.BASE, {
			commentId,
			content,
		});
		return response.data;
	} catch (error) {
		console.error("Error while updating comment", error);
		throw error;
	}
}

export async function deleteComment(commentId: string) {
	try {
		const response = await api.delete(API_ROUTES.COMMENT.BASE, {
			params: { commentId },
		});
		return response.data;
	} catch (error) {
		console.error("Error while deleting comment", error);
		throw error;
	}
}
