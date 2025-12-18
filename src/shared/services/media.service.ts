import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "../utils/apiWrapper";

/**
 * Requests a Cloudinary upload signature/token from the backend.
 * This token is used for secure client-side uploads.
 * 
 * @param resource_type - type of resource being uploaded ("image", "video", "raw", etc.)
 * @returns The token payload from the backend.
 */

export function generateToken(resource_type: string) {
	return apiRequest(() => api.post(API_ROUTES.MEDIA.GENERATE_TOKEN, {
		resource_type,
	}));
}

/**
 * Deletes a media file from Cloudinary via backend endpoint.
 * 
 * @param fileId - The Cloudinary public ID of the file to delete.
 * @param mediaType - The resource type of the file ("image", "video", "raw").
 * @returns Backend response confirming deletion.
 */


export function deleteFile(fileId: string, mediaType: string) {
	return apiRequest(() => api.delete(API_ROUTES.MEDIA.DELETE(fileId, mediaType)));
}
