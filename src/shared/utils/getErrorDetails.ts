
interface ApiError extends Error {
	status?: number;
	info?: { message?: string; [key: string]: any };
}


export  const getErrorDetails = (error? : Error | ApiError | string) => {
		let title = "Oops! Something went wrong";
		let message = "An unexpected error occurred. Please try again later.";

		if (typeof error === 'string') {
			message = error;
		} else if (error) {
			const apiError = error as ApiError;

			if (apiError.status === 400) {
				title = "400 - Bad Request";
				message = apiError.info?.message || "The request was invalid. Please check your input and try again.";
			} 
			else if (apiError.status === 401) {
				title = "401 - Unauthorized";
				message = "You need to be logged in to view this page.";
			} else if (apiError.status === 403) {
				title = "403 - Forbidden";
				message = "You do not have permission to view this page.";
			} else {
				message = apiError.message || message;
			}
		}

		return { title, message };
	};
