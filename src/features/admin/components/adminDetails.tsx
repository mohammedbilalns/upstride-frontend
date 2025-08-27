import { useAuthStore } from "@/store/auth.store";
import { createFallbackAvatar } from "@/lib/createFallbackAvatar";

interface AdminDetailsProps {
  isCollapsed: boolean;
}

export default function AdminDetails({ isCollapsed }: AdminDetailsProps) {
  const { name, role } = useAuthStore((state) => state.user!);
  return (
    <div className={`p-4 ${isCollapsed ? "" : ""}`}>
      {!isCollapsed ? (
        <div className="bg-card rounded-xl shadow-lg border border-border/50 p-4 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-semibold text-sm">
                {createFallbackAvatar(name)}
              </span>
            </div>
            <div className="flex-1 min-w-0 ml-3">
              <p className="text-sm font-semibold text-foreground truncate">
                {name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {/*Senior Administrator*/}
                {role}
              </p>
            </div>
            <div
              className="w-2 h-2 bg-green-500 rounded-full ml-2 shadow-sm"
              title="Online"
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-semibold text-sm">
                {createFallbackAvatar(name)}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background shadow-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
