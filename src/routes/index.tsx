import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/components/guards/auth-gaurd";

export const Route = createFileRoute("/")({
  beforeLoad: authGuard(["user"]),
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
}
