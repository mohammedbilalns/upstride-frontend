import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import NotFoundComponent from "./components/notFoundComponent";
import Loading from "./components/common/loading";
import { QueryClient } from "@tanstack/react-query";


export const queryClient = new QueryClient();

export function getRouter() {
	const router = createRouter({
		routeTree,
		defaultNotFoundComponent: NotFoundComponent,
		defaultPendingComponent: Loading,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultStaleTime: 5 * 60 * 1000,
	}) 

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	})
	return router 
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
