import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient, router } from "./app/router/routerConfig";
import { AppInitializer } from "./shared/utils/initialiser";
import { env } from "./shared/constants/env";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID as string;

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		{/* Provides Google OAuth context to the entire app */}
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			{/* Provides React Query's global client and cache context */}
			<QueryClientProvider client={queryClient}>
				<AppInitializer />
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</GoogleOAuthProvider>
	</StrictMode>,
);
