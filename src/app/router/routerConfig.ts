import { createRouter } from "@tanstack/react-router";
import Loading from "@/components/common/loading";
import NotFoundComponent from "@/components/notFoundComponent";
import { routeTree } from "@/routeTree.gen";

export const router = createRouter({
	routeTree,
	defaultNotFoundComponent: NotFoundComponent,
	defaultPendingComponent: Loading,
	scrollRestoration: true,
	defaultPreload: "intent",
	defaultStaleTime: 5 * 60 * 1000,
});
