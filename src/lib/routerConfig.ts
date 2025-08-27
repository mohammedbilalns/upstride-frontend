import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import NotFoundComponent from "@/components/notFoundComponent";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundComponent,
});
