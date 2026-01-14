import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
    to: string;
    icon: LucideIcon;
    name: string;
    badge?: string;
    isActive: boolean;
    isCollapsed: boolean;
    onClick?: () => void;
    exact?: boolean;
}

export function SidebarItem({
    to,
    icon: Icon,
    name,
    badge,
    isActive,
    isCollapsed,
    onClick,
}: SidebarItemProps) {
    return (
        <li>
            <Link
                to={to}
                onClick={onClick}
                className={`
          w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative cursor-pointer
          ${isActive
                        ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }
          ${isCollapsed ? "justify-center px-3" : ""}
        `}
                activeProps={{
                    className:
                        "bg-primary/10 text-primary border border-primary/20 shadow-sm",
                }}
                inactiveProps={{
                    className:
                        "text-muted-foreground hover:bg-accent hover:text-foreground",
                }}
                title={isCollapsed ? name : undefined}
            >
                <div className="flex items-center justify-center min-w-5">
                    <Icon
                        className={`
              h-5 w-5 shrink-0
              ${isActive
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
                            {name}
                        </span>
                        {badge && (
                            <span
                                className={`
                  px-2 py-1 text-xs font-semibold rounded-full
                  ${isActive
                                        ? "bg-primary/20 text-primary"
                                        : "bg-muted text-muted-foreground"
                                    }
                `}
                            >
                                {badge}
                            </span>
                        )}
                    </div>
                )}

                {/* Badge for collapsed state */}
                {isCollapsed && badge && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-background">
                        <span className="text-xs font-bold">
                            {parseInt(badge, 10) > 9 ? "9+" : badge}
                        </span>
                    </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {name}
                        {badge && (
                            <span className="ml-2 px-1.5 py-0.5 bg-muted text-muted-foreground rounded-full text-xs">
                                {badge}
                            </span>
                        )}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" />
                    </div>
                )}
            </Link>
        </li>
    );
}
