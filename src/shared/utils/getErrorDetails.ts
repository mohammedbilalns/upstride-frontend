/**
 * Extended error type for API or fetch responses.
 */
export interface ResponseError extends Error {
  status?: number;
  info?: { message?: string; [key: string]: unknown };
}

/**
 * Returns a user-friendly error title and message based on the error type.
 * Safely handles plain strings, standard errors, and API errors.
 *
 * @param error - The caught error (string, Error, or ResponseError)
 * @returns Object with `title` and `message` for display
 */
export const getErrorDetails = (
  error?: Error | ResponseError | string
): { title: string; message: string } => {
  let title = "Oops! Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";

  if (typeof error === "string") {
    message = error;
    return { title, message };
  }

  if (!error) return { title, message };

  const apiError = error as ResponseError;

  switch (apiError.status) {
    case 400:
      title = "400 - Bad Request";
      message =
        apiError.info?.message ||
        "The request was invalid. Please check your input and try again.";
      break;
    case 401:
      title = "401 - Unauthorized";
      message = "You need to be logged in to view this page.";
      break;
    case 403:
      title = "403 - Forbidden";
      message = "You do not have permission to access this resource.";
      break;
    case 404:
      title = "404 - Not Found";
      message = "The requested resource could not be found.";
      break;
    case 500:
      title = "500 - Server Error";
      message = "The server encountered an error. Please try again later.";
      break;
    default:
      // Fallback to general error message or API-provided info
      message = apiError.info?.message || apiError.message || message;
      break;
  }

  return { title, message };
};

