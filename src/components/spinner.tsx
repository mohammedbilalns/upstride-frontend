export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" }) {
	const sizeClass = size === "sm" ? "h-4 w-4 mr-2" : "h-6 w-6";
	return (
		<div className="flex justify-center py-2">
			<div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClass}`} />
		</div>
	);
}
