import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import Loading from "@/components/common/Loading";
import ErrorComponent from "@/components/Error";
import NotFoundComponent from "@/components/NotFoundComponent";
import { routeTree } from "@/routeTree.gen";
import { useAuthStore } from "@/app/store/auth.store";

export const queryClient = new QueryClient();

/**
 * Global router configuration for the app
 *  Integrates React Query and auth store via context
 */
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    authStore: useAuthStore
  },

  // Fallback components
  defaultNotFoundComponent: NotFoundComponent,
  defaultPendingComponent: Loading,
  defaultErrorComponent: ErrorComponent,

  scrollRestoration: true,

  // Preload route data on hover/ intent
  defaultPreload: "intent",

  defaultStaleTime: 5 * 60 * 1000,
});

