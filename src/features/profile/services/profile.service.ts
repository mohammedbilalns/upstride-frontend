import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "@/shared/utils/apiWrapper";

/**
 * Fetches the private profile of a user.
 *
 * @param id - Unique identifier of the user whose profile is being fetched.
 * @returns User profile data.
 */
export function fetchProfile(id: string) {
	return apiRequest(() => api.get(API_ROUTES.PROFILE.FETCH(id)))
}

/**
 * Updates the authenticated user's profile details.
 *
 * @param data - Payload containing profile fields to be updated
 *               (e.g., name, avatar, bio, expertise, etc.).
 * @returns Backend response confirming profile update.
 */
export function updateProfile(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.PROFILE.UPDATE, data))
}

/**
 * Changes the authenticated user's password.
 *
 * @param data - Object containing the current and new password.
 * @param data.oldPassword - User's existing password.
 * @param data.newPassword - New password to be set.
 * @returns Backend response confirming password change.
 */
export function changePassword(data: {
	oldPassword: string;
	newPassword: string;
}) {
	return apiRequest(() => api.put(API_ROUTES.PROFILE.UPDATE_PASSWORD, data))
}

