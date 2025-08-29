import { LogOut } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface LogoutProps {
  isCollapsed: boolean;
}
export default function Logout({ isCollapsed }: LogoutProps) {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    console.log("fsnfksjd");
    logoutMutation.mutate();
  };

  return (
    <div className="px-4 pb-6">
      <button
        onClick={() => handleLogout()}
        className={`
           w-full flex items-center rounded-xl text-left transition-all duration-200 group border border-border/50
           bg-destructive/10 text-destructive hover:bg-destructive hover:text-white hover:shadow-lg cursor-pointer
           ${isCollapsed ? "justify-center p-3" : "space-x-3 px-4 py-3"}
         `}
        title={isCollapsed ? "Logout" : undefined}
      >
        <div className="flex items-center justify-center min-w-[20px]">
          <LogOut className="h-5 w-5 flex-shrink-0" />
        </div>

        {!isCollapsed && (
          <span className="text-sm font-medium">
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </span>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 cursor-pointer ">
            Logout
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" />
          </div>
        )}
      </button>
    </div>
  );
}
