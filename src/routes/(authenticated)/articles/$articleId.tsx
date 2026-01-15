import { createFileRoute } from "@tanstack/react-router";

import { ArticleNotFound } from "@/features/articles-mangement/components/ArticleNotFound";

import ArticleDetailsPage from "@/features/articles-mangement/pages/ArticleDetailsPage";

import { articleQueryOptions } from "@/features/articles-mangement/services/article.service";
import { useAuthStore } from "@/app/store/auth.store";

export const Route = createFileRoute("/(authenticated)/articles/$articleId")({
	component: ArticleDetailsPage,
	notFoundComponent: ArticleNotFound,
	loader: async ({ params, context }) => {
		const { articleId } = params;
		await context.queryClient.ensureQueryData(articleQueryOptions(articleId));
		const { user } = useAuthStore.getState();
		return { user };
	},
});


