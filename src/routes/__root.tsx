import { createRootRoute, Outlet } from "@tanstack/react-router";
import * as React from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "@/store/theme.store";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const { isDarkMode, setTheme } = useThemeStore();

	useEffect(() => {
		setTheme(isDarkMode);
	}, [isDarkMode, setTheme]);
	return (
		<React.Fragment>
			<Outlet />
			<Toaster></Toaster>
		</React.Fragment>
	);
}
