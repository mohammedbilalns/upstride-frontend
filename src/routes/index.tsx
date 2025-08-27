import { createFileRoute } from "@tanstack/react-router";
import { authGuard } from "@/components/guards/auth-gaurd";
import { Header } from "@/components/layouts/header";

export const Route = createFileRoute("/")({
  beforeLoad: authGuard(["user"]),
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <Header />
      <h3>Welcome Home!</h3>
    </div>
  );
}
