import type { AxiosResponse } from "axios";

/**
 * Wraps an Axios request to provide a consistent API response handling.
 * Centralizes error logging and rethrows errors for upstream handling.
 *
 * @typeParam T - Expected response data type.
 * @param request - A function that returns an Axios promise.
 * @returns The response data extracted from the Axios response.
 * @throws Rethrows any error encountered during the request.
 */
export async function apiRequest<T>(
    request: () => Promise<AxiosResponse<T>>
): Promise<T> {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        console.error("API request failed:", error);
        throw error;
    }
}
