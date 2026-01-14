import ArticleEditPage from "@/features/articles-mangement/pages/ArticleEditPage";
import { createFileRoute } from "@tanstack/react-router";


import { articleQueryOptions } from "@/features/articles-mangement/services/article.service";

export const Route = createFileRoute(
	"/(authenticated)/articles/edit/$articleId",
)({
	component: ArticleEditPage,
	loader: ({ context, params: { articleId } }) =>
		context.queryClient.ensureQueryData(articleQueryOptions(articleId)),
});


