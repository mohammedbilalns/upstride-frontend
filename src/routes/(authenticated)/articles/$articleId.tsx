import { createFileRoute } from "@tanstack/react-router";

import { ArticleNotFound } from "@/features/articles-mangement/components/ArticleNotFound";
import {
	fetchArticle,
} from "@/features/articles-mangement/services/article.service";
import ArticleDetailsPage from "@/features/articles-mangement/pages/ArticleDetailsPage";

export const Route = createFileRoute("/(authenticated)/articles/$articleId")({
	component: ArticleDetailsPage,
	notFoundComponent: ArticleNotFound,
	loader: async ({ params, context }) => {
		const { articleId } = params;
		return context.queryClient.fetchQuery({
			queryKey: ["article", articleId],
			queryFn: () => fetchArticle(articleId),
		});
	},
});


