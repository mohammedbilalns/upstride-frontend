import { createFileRoute } from "@tanstack/react-router";
import { articlesQueryOptions } from "@/features/articles-mangement/services/article.service";

import { articlesParamsSchema } from "../../../features/articles-mangement/schemas/article-params.schema";
import ArticleListPage from "@/features/articles-mangement/pages/ArticleListPage";

export const Route = createFileRoute("/(authenticated)/articles/")({
	component: ArticleListPage,
	validateSearch: (search: Record<string, string>) => {
		return articlesParamsSchema.parse(search);
	},
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context, deps: { search } }) => {
		const { user } = context.authStore.getState();
		await context.queryClient.ensureInfiniteQueryData(
			articlesQueryOptions(
				search.query,
				search.category,
				search.tag,
				search.sortBy,
			),
		);
		return {
			user,
		};
	},
});



