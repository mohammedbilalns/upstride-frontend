import React, { useState, useEffect } from "react";
import {
  Home,
  MessageCircle,
  Settings,
  Menu,
  ChartLine,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Newspaper,
  Users,
  Star,
} from "lucide-react";
import Logout from "@/features/admin/components/logoutButton";
import AdminDetails from "@/features/admin/components/adminDetails";
import ThemeToggle from "../theme-toggle";
import { useRouter } from "@tanstack/react-router";

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SidebarProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  {
    id: "usermanagement",
    name: "User Management",
    icon: Users,
    href: "/usermanagement",
  },
  {
    id: "expertisemanagement",
    name: "Expertise Management",
    icon: Star,
    href: "/expertisemanagement",
  },

  {
    id: "mentormanagement",
    name: "Mentor Management",
    icon: ShieldCheck,
    href: "/mentormanagement",
  },
  { id: "articles", name: "Articles", icon: Newspaper, href: "/articles" },
  {
    id: "chatandsessions",
    name: "Chat & Sessions",
    icon: MessageCircle,
    href: "/chatandselp",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: ChartLine,
    href: "/analytics",
  },
  { id: "settings", name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar({ className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const router = useRouter();

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
    router.navigate({ to: `/admin/${item.href}` });
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-card shadow-lg border border-border/50 backdrop-blur-sm md:hidden hover:bg-accent transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-background to-muted/20 border-r border-border/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-80"}
          md:translate-x-0 md:relative md:z-auto
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-lg">
                  S
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-xl">
                  SkillShare
                </span>
                <span className="text-sm text-muted-foreground">Dashboard</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-primary-foreground font-bold text-lg">
                S
              </span>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-2 rounded-lg hover:bg-accent transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 px-4 scrollbar-hide py-2  scrollbar-hide ${
            isCollapsed ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative cursor-pointer
                      ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }
                      ${isCollapsed ? "justify-center px-3" : ""}
                    `}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex items-center justify-center min-w-[20px]">
                      <Icon
                        className={`
                          h-5 w-5 flex-shrink-0
                          ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          }
                        `}
                      />
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
                        >
                          {item.name}
                        </span>
                        {item.badge && (
                          <span
                            className={`
                            px-2 py-1 text-xs font-semibold rounded-full
                            ${
                              isActive
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }
                          `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Badge for collapsed state */}
                    {isCollapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-background">
                        <span className="text-xs font-bold">
                          {parseInt(item.badge) > 9 ? "9+" : item.badge}
                        </span>
                      </div>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                            {item.badge}
                          </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`p-4 flex ${isCollapsed ? "justify-center" : "justify-start"}`}
        >
          <ThemeToggle />
        </div>

        <div className="mt-auto border-t border-border/50 backdrop-blur-sm">
          <AdminDetails isCollapsed={isCollapsed} />
          <Logout isCollapsed={isCollapsed} />
        </div>
      </div>
    </>
  );
}
