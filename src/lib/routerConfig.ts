import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import NotFoundComponent from "@/components/notFoundComponent";
import Loading from "@/components/loading";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundComponent,
	defaultPendingComponent: Loading,
	scrollRestoration: true,
	defaultPreload:'intent'
});
