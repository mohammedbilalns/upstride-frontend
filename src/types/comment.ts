export interface CreateCommentData {
	articleId: string;
	content: string;
	parentCommentId?: string;
}
