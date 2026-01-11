import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import { apiRequest } from "../utils/apiWrapper";
import type { CloudinaryResponse } from "../types/cloudinaryResponse";
import axios from "axios";
import { env } from "@/shared/constants/env";

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
	// URL encode the fileId to handle slashes in Cloudinary public_id (e.g., "folder/filename")
	const encodedFileId = encodeURIComponent(fileId);
	return apiRequest(() => api.delete(API_ROUTES.MEDIA.DELETE(encodedFileId, mediaType)));
}

export function uploadMedia(
	file: File,
	resourceType: string,
	onProgress?: (progress: number) => void,
) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("resource_type", resourceType);

	return apiRequest(() =>
		axios.post<{ message: string; data: CloudinaryResponse }>(
			`${env.API_URL}${API_ROUTES.MEDIA.UPLOAD}`,
			formData,
			{
				withCredentials: true,
				headers: {
					"Content-Type": undefined,
				},
				onUploadProgress: (progressEvent) => {
					if (onProgress && progressEvent.total) {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total,
						);
						onProgress(percentCompleted);
					}
				},
			},
		),
	);
}
