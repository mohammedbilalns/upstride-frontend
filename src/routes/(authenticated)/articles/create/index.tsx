import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/shared/guards/auth-gaurd";
import ArticleCreatePage from "@/features/articles-mangement/pages/ArticleCreatePage";

export const Route = createFileRoute("/(authenticated)/articles/create/")({
	component: ArticleCreatePage,
	beforeLoad: authGuard(["mentor"]),
});


