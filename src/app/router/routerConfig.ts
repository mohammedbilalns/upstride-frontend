import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import Loading from "@/components/common/Loading";
import ErrorComponent from "@/components/Error";
import NotFoundComponent from "@/components/NotFoundComponent";
import { routeTree } from "@/routeTree.gen";

// React Query client 
export const queryClient = new QueryClient();

/**
 * Global router configuration for the app
 * - Integrates React Query via context
 * - Defines default loading, error, and 404 components
 * - Enables scroll restoration and route preloading
 */
export const router = createRouter({
  routeTree,
  context: { queryClient },

  // Fallback components
  defaultNotFoundComponent: NotFoundComponent,
  defaultPendingComponent: Loading,
  defaultErrorComponent: ErrorComponent,

  // Scroll position is preserved between navigations
  scrollRestoration: true,

  // Preload route data on hover or intent
  defaultPreload: "intent",

  // Default React Query cache time (5 min)
  defaultStaleTime: 5 * 60 * 1000,
});

