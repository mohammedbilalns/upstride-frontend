import { createFileRoute } from "@tanstack/react-router";
import { publicGuard } from "@/components/guards/public-guard";
import LandingPage from "@/components/landing";

export const Route = createFileRoute("/")({
	beforeLoad: publicGuard(),
	component: Index,
});

function Index() {
	return <LandingPage />;
}
