import { createFileRoute } from "@tanstack/react-router";

import { articlesQueryOptions } from "@/features/articles-mangement/services/article.service";
import HomePage from "@/features/home/pages/HomePage";


export const Route = createFileRoute("/(authenticated)/home/")({
	component: HomePage,
	loader: async ({ context }) => {
		const { user } = context.authStore.getState();
		await context.queryClient.ensureInfiniteQueryData(articlesQueryOptions());
		return {
			user,
		};
	},
});

