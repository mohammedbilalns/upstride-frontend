import { useNavigate } from "@tanstack/react-router";
import { getErrorDetails } from "@/shared/utils/getErrorDetails";

interface ApiError extends Error {
	status?: number;
	info?: { message?: string; [key: string]: unknown };
}

interface ErrorComponentProps {
	error?: Error | ApiError | string;
	resetError?: () => void;
}

export default function ErrorComponent({
	error,
	resetError,
}: ErrorComponentProps) {
	const navigate = useNavigate();

	const { title, message } = getErrorDetails(error);

	return (
		<div className="min-h-[92vh] flex flex-col justify-center items-center p-8 bg-gradient-to-b from-background to-muted/20">
			<div className="bg-card rounded-xl shadow-lg border border-border/50 p-8 backdrop-blur-sm text-center max-w-md w-full">
				<div className="mb-4 flex justify-center">
					<div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					</div>
				</div>

				<h1 className="text-3xl font-bold mb-4 text-foreground">{title}</h1>

				<p className="text-muted-foreground mb-6">{message}</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						onClick={() => navigate({ to: "/" })}
						type="button"
						className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
					>
						Go Home
					</button>

					{resetError && (
						<button
							onClick={resetError}
							type="button"
							className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
						>
							Try Again
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
