import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Calendar, Settings, Users } from "lucide-react";
import { SidebarItem } from "@/components/common/SidebarItem";

export const Route = createFileRoute("/(authenticated)/mentor")({
  component: MentorLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/mentor" || location.pathname === "/mentor/") {
      throw redirect({
        to: "/mentor/dashboard",
      });
    }
  },
});

function MentorLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/mentor/dashboard",
      isActive: (path: string) => path === "/mentor/dashboard",
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/mentor/calendar",
      isActive: (path: string) => path.startsWith("/mentor/calendar"),
    },
    {
      title: "My Network",
      icon: Users,
      href: "/mentor/network",
      isActive: (path: string) => path === "/mentor/network",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/mentor/settings/profile",
      isActive: (path: string) => path.startsWith("/mentor/settings"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-background border-r border-border/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out flex flex-col w-full lg:w-64">
              <div className="font-semibold text-lg px-4 mb-4">Mentor Portal</div>

              {/* Navigation */}
              <nav className="flex-1 px-4 scrollbar-hide py-2 overflow-y-auto">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <SidebarItem
                      key={item.href}
                      to={item.href}
                      icon={item.icon}
                      name={item.title}
                      isActive={item.isActive(pathname)}
                      isCollapsed={false}
                    />
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full">
            <Outlet />
          </main>
        </div>
      </main>
    </div>
  );
}
