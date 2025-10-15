import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
	const router = useRouter();
	return (
		<div className="flex-1 flex items-center justify-center p-6">
			<div className="bg-card rounded-xl shadow-lg border border-border/50 backdrop-blur-sm p-8 text-center max-w-md w-full">
				<h1 className="text-6xl font-extrabold mb-4 text-foreground">404</h1>
				<p className="text-lg text-muted-foreground mb-6">
					Oops! The page you’re looking for doesn’t exist.
				</p>

				<Button
					onClick={() => router.navigate({ to: "/admin/dashboard" })}
					className="cursor-pointer"
				>
					Go back home
				</Button>
			</div>
		</div>
	);
}
