import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { useEffect } from "react";
import appCss from '../index.css?url'
import { Toaster } from "sonner";
import { useThemeStore } from "@/app/store/theme.store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppInitializer } from "@/shared/utils/initialiser";
import { StoreHydrator } from "@/components/storeHydrator";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { isDarkMode, setTheme } = useThemeStore();

	useEffect(() => {
		setTheme(isDarkMode);
	}, [isDarkMode, setTheme]);

	return (
		<StoreHydrator>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</StoreHydrator>
	);
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AppInitializer />
          {children}
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </GoogleOAuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
