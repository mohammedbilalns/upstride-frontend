import type { CredentialResponse } from "@react-oauth/google";
import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";
import type { loginFormValues, RegisterFormValues } from "../-validations";

export async function userLogin(data: loginFormValues) {
	try {
		const response = await api.post(API_ROUTES.AUTH.LOGIN, data);
		return response.data;
	} catch (error) {
		console.error("error while login", error);
		throw error;
	}
}
export async function userRegister(data: RegisterFormValues) {
	try {
		const response = await api.post(API_ROUTES.AUTH.REGISTER, data);
		return response.data;
	} catch (error) {
		console.error("error while signup", error);
		throw error;
	}
}

export async function verifyRegisterOtp(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.VERIFY_OTP, data);
		return response.data;
	} catch (error) {
		console.error("error whie verifying otp", error);
		throw error;
	}
}

export async function resendRegisterOtp(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.RESEND_REGISTER_OTP, data);
		return response.data;
	} catch (error) {
		console.error("error while resending otp", error);
		throw error;
	}
}

export async function initiatePasswordReset(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
		return response.data;
	} catch (error) {
		console.error("error while initiating password reset", error);
		throw error;
	}
}

export async function verifyResetOtp(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.VERIFY_RESET_OTP, data);
		return response.data;
	} catch (error) {
		console.error("error while verifying reset otp", error);
		throw error;
	}
}

export async function resendResetOtp(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.RESEND_RESET_OTP, data);
		return response.data;
	} catch (error) {
		console.error("error while resending reset otp", error);
		throw error;
	}
}

export async function updatePassword(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.UPDATE_PASSWORD, data);
		return response.data;
	} catch (error) {
		console.error("error while updating password", error);
		throw error;
	}
}

export async function logout() {
	try {
		const response = await api.post(API_ROUTES.AUTH.LOGOUT);
		return response.data;
	} catch (error) {
		console.error("error while logging out ", error);
		throw error;
	}
}

export async function googleLogin(credentials: CredentialResponse) {
	try {
		const response = await api.post(API_ROUTES.AUTH.GOOGLE, credentials);
		return response.data;
	} catch (error) {
		console.error("error while logging in with google", error);
		throw error;
	}
}

export async function fetchExpertiseAreas() {
	try {
		const response = await api.get(API_ROUTES.EXPERTISE.FETCH);
		return response.data;
	} catch (error) {
		console.error("error while fetching expertise areas", error);
		throw error;
	}
}

export async function saveInterests(data: unknown) {
	try {
		const response = await api.post(API_ROUTES.AUTH.ADD_INTERESTS, data);
		return response.data;
	} catch (error) {
		console.error("error while saving expertise and skills", error);
		throw error;
	}
}
