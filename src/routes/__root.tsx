import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/app/store/theme.store";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	const { isDarkMode, setTheme } = useThemeStore();

	useEffect(() => {
		setTheme(isDarkMode);
	}, [isDarkMode, setTheme]);

	return (
		<React.Fragment>
			{/* <NetworkStatusIndicator/> */}

			<Outlet />
			<TanStackRouterDevtools />
			<Toaster></Toaster>
		</React.Fragment>
	);
}
