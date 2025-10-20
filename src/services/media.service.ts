import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function generateToken(resource_type: string) {
	try {
		const response = await api.post(API_ROUTES.MEDIA.GENERATE_TOKEN, {
			resource_type,
		});
		return response.data;
	} catch (err) {
		console.error("error while generating token", err);
		throw err;
	}
}

export async function deleteFile(fileId: string, mediaType: string) {
	try {
		const response = await api.delete(
			API_ROUTES.MEDIA.DELETE(fileId, mediaType),
		);
		return response.data;
	} catch (err) {
		console.error("error while deleting file", err);
		throw err;
	}
}
