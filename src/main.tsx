import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient, router } from "./app/router/routerConfig";
import { AppInitializer } from "./shared/utils/initialiser";
import * as Sentry from "@sentry/browser"

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

Sentry.init({ dsn: import.meta.env.VITE_GLICHTIP_ISN });


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<QueryClientProvider client={queryClient}>
				<AppInitializer />
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</GoogleOAuthProvider>
	</StrictMode>,
);
