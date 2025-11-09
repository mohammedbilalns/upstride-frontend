import { useNavigate } from "@tanstack/react-router";

export default function NotFoundComponent() {
	const navigate = useNavigate();
	return (
		<div className="min-h-[92vh] flex flex-col justify-center items-center p-8 bg-linear-to-b from-background to-muted/20">
			<div className="bg-card rounded-xl shadow-lg border border-border/50 p-8 backdrop-blur-sm text-center max-w-md w-full">
				<h1 className="text-4xl font-bold mb-4 text-foreground">
					404 - Page Not Found
				</h1>
				<p className="text-muted-foreground mb-6">
					Oops! The page you are looking for does not exist.
				</p>
				<button
					onClick={() => navigate({ to: "/" })}
					type="button"
					className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
				>
					Go Home
				</button>
			</div>
		</div>
	);
}
