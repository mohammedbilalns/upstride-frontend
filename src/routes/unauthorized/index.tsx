import { createFileRoute, useRouter } from "@tanstack/react-router";
import { authGuard } from "@/app/guards/auth-gaurd";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized/")({
	beforeLoad: authGuard(["user", "admin", "mentor"]),
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	return (
		<div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center p-8 bg-gradient-to-b from-background to-muted/20">
			<div className="w-full max-w-md text-center bg-card rounded-xl shadow-lg border border-border/50 p-8 backdrop-blur-sm">
				<h1 className="text-3xl font-bold mb-4 text-foreground">
					Access Denied
				</h1>
				<p className="text-muted-foreground text-lg mb-6">
					You do not have permission to view this page.
				</p>
				<Button variant="default" onClick={() => router.navigate({ to: "/" })}>
					Go to Home
				</Button>
			</div>
		</div>
	);
}
