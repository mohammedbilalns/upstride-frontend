import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import Loading from "@/components/common/Loading";
import ErrorComponent from "@/components/Error";
import NotFoundComponent from "@/components/NotFoundComponent";
import { routeTree } from "@/routeTree.gen";

export const queryClient = new QueryClient();

export const router = createRouter({
	routeTree,
	context: { queryClient },
	defaultNotFoundComponent: NotFoundComponent,
	defaultPendingComponent: Loading,
	defaultErrorComponent: ErrorComponent,
	scrollRestoration: true,
	defaultPreload: "intent",
	defaultStaleTime: 5 * 60 * 1000,
});
