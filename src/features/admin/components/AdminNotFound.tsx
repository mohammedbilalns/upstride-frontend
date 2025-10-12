import { useRouter } from "@tanstack/react-router";

export default function AdminNotFound() {
	const router = useRouter();
	return (
		<div className="flex-1 flex items-center justify-center p-6">
			<div className="bg-card rounded-xl shadow-lg border border-border/50 backdrop-blur-sm p-8 text-center max-w-md w-full">
				<h1 className="text-6xl font-extrabold mb-4 text-foreground">404</h1>
				<p className="text-lg text-muted-foreground mb-6">
					Oops! The page you’re looking for doesn’t exist.
				</p>

				<a
					onClick={() => router.navigate({ to: "/admin/dashboard" })}
					className="inline-block cursor-pointer px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow hover:shadow-lg transition-all duration-200"
				>
					Go back home
				</a>
			</div>
		</div>
	);
}
