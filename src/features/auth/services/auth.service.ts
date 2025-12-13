import type { CredentialResponse } from "@react-oauth/google";
import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { loginFormValues, RegisterFormValues } from "../schemas";
import { apiRequest } from "@/shared/utils/apiWrapper";

export function userLogin(data: loginFormValues) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.LOGIN, data))
}

export function userRegister(data: RegisterFormValues) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.REGISTER, data))
}

export function verifyRegisterOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.VERIFY_OTP, data))
}

export function resendRegisterOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.RESEND_REGISTER_OTP, data))
}

export function initiatePasswordReset(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.RESET_PASSWORD, data))
}

export function verifyResetOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.VERIFY_RESET_OTP, data))
}

export function resendResetOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.RESEND_RESET_OTP, data))
}

export function updatePassword(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.UPDATE_PASSWORD, data))
}

export function logout() {
	return apiRequest(() => api.post(API_ROUTES.AUTH.LOGOUT))
}

export function googleLogin(credentials: CredentialResponse) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.GOOGLE, credentials))
}

export function fetchExpertiseAreas() {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.FETCH))
}

export function saveInterests(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.ADD_INTERESTS, data))
}
