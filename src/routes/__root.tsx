import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/layouts/header";
import { useThemeStore } from "@/store/theme.store";
import { useEffect } from "react";

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
      <Header />
      <Outlet />
      <Toaster></Toaster>
    </React.Fragment>
  );
}
