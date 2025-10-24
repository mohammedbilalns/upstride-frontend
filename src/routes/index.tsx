import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/components/landing";
import { publicGuard } from "@/shared/guards/public-guard";

export const Route = createFileRoute("/")({
	beforeLoad: publicGuard(),
	component: Index,
});

function Index() {
	return <LandingPage />;
}
