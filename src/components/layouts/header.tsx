"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import ThemeToggle from "../theme-toggle";
import { Link } from "@tanstack/react-router";

export function Header() {
  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Create",
      href: "/blog/create",
    },
  ];
  return (
    <header className="border-b bg-background sticky top-0 z-10 ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6  ">
        <div className="flex flex-items gap-6">
          <Link to="/" className="font-bold text-xl">
            SkillShare
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((navItem) => (
              <Link
                key={navItem.href}
                to={navItem.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary"
                )}
              >
                {navItem.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">{/* search */}</div>
          <ThemeToggle></ThemeToggle>
          <div className="flex items-center gap-2 ">
            <Button variant={"default"} asChild>
              <Link to="/auth">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
