import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
	message?: string;
	onRetry?: () => void;
	variant?: "default" | "compact";
}

export default function ErrorState({
	message = "Something went wrong. Please try again later.",
	onRetry,
	variant = "default",
}: ErrorStateProps) {
	if (variant === "compact") {
		return (
			<div className="flex items-center justify-center p-4 text-center">
				<div className="flex flex-col items-center space-y-2">
					<AlertCircle className="h-5 w-5 text-destructive" />
					<p className="text-sm text-muted-foreground">{message}</p>
					{onRetry && (
						<Button
							variant="outline"
							size="sm"
							onClick={onRetry}
							className="mt-2 cursor-pointer"
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							Retry
						</Button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center p-6 text-center">
			<AlertCircle className="h-12 w-12 text-destructive mb-4" />
			<p className="text-muted-foreground mb-4">{message}</p>
			{onRetry && (
				<Button variant="outline" onClick={onRetry}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Try Again
				</Button>
			)}
		</div>
	);
}
