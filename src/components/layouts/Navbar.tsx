import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/common/UserAvatar";
import { NotificationsDropdown } from "@/features/notifications/components/NotificationDropdown";
import ThemeToggle from "../common/Theme-toggle";
import { useAuthStore } from "@/app/store/auth.store";
import { motion } from "framer-motion";
import { useLogout } from "@/features/authentication/hooks/logout.hooks";

/**
 * Main navigation bar 
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const logoutMutation = useLogout();
  const { user } = useAuthStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const baseNavLinks = [
    { label: "Articles", href: "/articles", section: "articles" },
    { label: "Explore Mentors", href: "/mentors", section: "mentors" },
    { label: "Sessions", href: "/sessions", section: "sessions" },
    { label: "Chats", href: "/chats", section: "chats" },
  ];

  const navLinks = user?.role === "mentor"
    ? [...baseNavLinks, { label: "Mentor Dashboard", href: "/mentor/dashboard", section: "mentor-dashboard" }]
    : baseNavLinks;

  const isActive = (href: string) => currentPath.startsWith(href);

  return (
    <header className="relative z-50 border-b border-border/50 bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            UpStride
          </h1>
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.section}
                to={link.href}
                className={`relative font-medium transition-all duration-200 ${active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* --- Right Actions --- */}
        <div className="flex items-center space-x-4">
          <NotificationsDropdown />
          <ThemeToggle />

          {/* User Dropdown */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
                aria-label="User menu"
              >
                {user && (
                  <UserAvatar
                    name={user.name}
                    image={user.profilePicture}
                    size={15}
                  />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-4 py-2 text-sm">
                <div className="font-medium truncate">{user?.name}</div>
              </div>
              <Separator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={() => logoutMutation.mutate()}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --- Mobile Menu Toggle --- */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      {isOpen && (
        <div className="md:hidden py-3 border-t border-border/50 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.section}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

