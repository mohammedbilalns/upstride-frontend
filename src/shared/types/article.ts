export interface Tag {
	_id: string;
	name: string;
}

export interface Article {
	id: string;
	author: string;
	authorName: string;
	authorImage?: string;
	title: string;
	description: string;
	content: string;
	featuredImage: string | null;
	likes: number;
	views: number;
	comments: number;
	createdAt: string;
	tags: Tag[];
}

export type ArticleInList = Omit<Article, "content">;

export type ArticlesResponse = {
	articles: Article[]
	total: number
}

export type ArticleResponse = {
	article: Article,
	isViewed: boolean,
	isLiked: boolean
}
