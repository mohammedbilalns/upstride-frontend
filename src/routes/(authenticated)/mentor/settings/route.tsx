import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { User, DollarSign, CalendarClock } from "lucide-react";

import { SidebarItem } from "@/components/common/SidebarItem";

export const Route = createFileRoute("/(authenticated)/mentor/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const settingsItems = [
    {
      title: "Profile",
      description: "Manage your public profile",
      icon: User,
      href: "/mentor/settings/profile",
      isActive: (path: string) => path === "/mentor/settings/profile",
    },
    {
      title: "Pricing",
      description: "Configure session rates",
      icon: DollarSign,
      href: "/mentor/settings/pricing",
      isActive: (path: string) => path === "/mentor/settings/pricing",
    },
    {
      title: "Availability",
      description: "Set recurring rules",
      icon: CalendarClock,
      href: "/mentor/settings/availability",
      isActive: (path: string) => path === "/mentor/settings/availability",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <nav className="flex flex-col space-y-1">
            {settingsItems.map((item) => (
              <SidebarItem
                key={item.href}
                to={item.href}
                icon={item.icon}
                name={item.title}
                isActive={item.isActive(pathname)}
                isCollapsed={false}
              />
            ))}
          </nav>
        </aside>
        <div className="flex-1 overflow-y-auto pr-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
