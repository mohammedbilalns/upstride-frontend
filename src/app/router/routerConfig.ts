import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import Loading from "@/components/common/loading";
import ErrorComponent from "@/components/error";
import NotFoundComponent from "@/components/notFoundComponent";
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
