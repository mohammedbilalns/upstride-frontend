import { createRouter } from "@tanstack/react-router";
import Loading from "@/components/common/loading";
import NotFoundComponent from "@/components/notFoundComponent";
import { routeTree } from "@/routeTree.gen";
import { QueryClient } from "@tanstack/react-query";

export const queryClient  = new QueryClient()

export const router = createRouter({
	routeTree,
	context: {queryClient},
	defaultNotFoundComponent: NotFoundComponent,
	defaultPendingComponent: Loading,
	scrollRestoration: true,
	defaultPreload: "intent",
	defaultStaleTime: 5 * 60 * 1000,
});
