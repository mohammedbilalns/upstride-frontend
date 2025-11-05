import { createFileRoute } from "@tanstack/react-router";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import NoResource from "@/components/common/NoResource";

export const Route = createFileRoute("/(authenticated)/chats/")({
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <NoResource 
        resource="chats" 
        isHome={true}
      />
    </div>
  );
}
