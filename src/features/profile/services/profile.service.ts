import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";

export async function fetchProfile(id: string) {
	try {
		const response = await api.get(API_ROUTES.PROFILE.FETCH(id));
		return response.data;
	} catch (error) {
		console.error("error while fetching profile", error);
		throw error;
	}
}

export async function updateProfile(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.PROFILE.UPDATE, data);
		return response.data;
	} catch (error) {
		console.error("error while updating profile", error);
		throw error;
	}
}

export async function changePassword(data: {
	oldPassword: string;
	newPassword: string;
}) {
	try {
		const response = await api.put(API_ROUTES.PROFILE.UPDATE_PASSWORD, data);
		return response.data;
	} catch (error) {
		console.error("error while updating password", error);
		throw error;
	}
}
