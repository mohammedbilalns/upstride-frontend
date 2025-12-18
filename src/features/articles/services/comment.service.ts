import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "@/shared/utils/apiWrapper";

/**
 * Fetches comments for a specific article with pagination support.
 * Can also fetch replies by providing a parent comment ID.
 *
 * @param articleId - Unique identifier of the article.
 * @param page - Page number for paginated comments.
 * @param limit - Number of comments per page.
 * @param parentCommentId - Optional parent comment ID to fetch replies.
 * @returns Paginated list of comments.
 */
export function fetchComments(
	articleId: string,
	page: number,
	limit: number,
	parentCommentId?: string,
) {
	return apiRequest(() => api.get(API_ROUTES.COMMENT.BASE, {
		params: {
			articleId,
			page,
			limit,
			parentCommentId,
		},
	}))
}

/**
 * Creates a new comment for an article.
 * Can be used to create a top-level comment or a reply.
 *
 * @param articleId - Unique identifier of the article.
 * @param content - Comment text content.
 * @param parentCommentId - Optional parent comment ID (for replies).
 * @returns Backend response containing the created comment.
 */
export function createComment(
	articleId: string,
	content: string,
	parentCommentId?: string,
) {
	return apiRequest(() => api.post(API_ROUTES.COMMENT.BASE, {
		articleId,
		content,
		parentCommentId,
	}))
}

/**
 * Updates the content of an existing comment.
 *
 * @param commentId - Unique identifier of the comment.
 * @param content - Updated comment text.
 * @returns Backend response confirming comment update.
 */
export function updateComment(commentId: string, content: string) {
	return apiRequest(() => api.put(API_ROUTES.COMMENT.BASE, {
		commentId,
		content,
	}))
}

/**
 * Deletes a comment by its identifier.
 *
 * @param commentId - Unique identifier of the comment to delete.
 * @returns Backend response confirming comment deletion.
 */
export function deleteComment(commentId: string) {
	return apiRequest(() => api.delete(API_ROUTES.COMMENT.BASE, {
		params: { commentId },
	}))
}
