export interface CreateCommentData {
	articleId: string;
	content: string;
	parentCommentId?: string;
}


export interface Comment {
	id: string;
	articleId: string;
	userId: string;
	userName: string;
	userImage?: string; 
	likes: number;
	replies: number;
	content: string; 
	createdAt: string;
}
