import type { CredentialResponse } from "@react-oauth/google";
import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { loginFormValues, RegisterFormValues } from "../schemas";
import { apiRequest } from "@/shared/utils/apiWrapper";

/**
 * Authenticates a user using email and password.
 *
 * @param data - Login form payload (email, password).
 * @returns Auth response containing tokens and user info.
 */
export function userLogin(data: loginFormValues) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.LOGIN, data))
}

/**
 * Registers a new user account.
 *
 * @param data - Registration form payload.
 * @returns Backend response indicating registration success.
 */
export function userRegister(data: RegisterFormValues) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.REGISTER, data))
}

/**
 * Verifies the OTP sent during user registration.
 *
 * @param data - OTP verification payload (otp, email/userId).
 * @returns Verification result from backend.
 */

export function verifyRegisterOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.VERIFY_OTP, data))
}

/**
 * Resends the OTP for user registration verification.
 *
 * @param data - Payload identifying the user (email/userId).
 * @returns Backend response confirming OTP resend.
 */
export function resendRegisterOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.RESEND_REGISTER_OTP, data))
}

/**
 * Initiates the password reset process.
 * Sends an OTP to the user's registered email.
 *
 * @param data - Payload containing email or identifier.
 * @returns Backend response confirming reset initiation.
 */
export function initiatePasswordReset(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.RESET_PASSWORD, data))
}


/**
 * Verifies the OTP sent for password reset.
 *
 * @param data - OTP verification payload.
 * @returns Backend response indicating OTP validity.
 */
export function verifyResetOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.VERIFY_RESET_OTP, data))
}

/**
 * Resends the OTP for the password reset flow.
 *
 * @param data - Payload identifying the user.
 * @returns Backend response confirming OTP resend.
 */
export function resendResetOtp(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.RESEND_RESET_OTP, data))
}

/**
 * Updates the user's password after successful OTP verification.
 *
 * @param data - New password payload along with reset token/OTP.
 * @returns Backend response confirming password update.
 */
export function updatePassword(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.UPDATE_PASSWORD, data))
}

/**
 * Logs out the currently authenticated user.
 * Invalidates session or refresh token on the backend.
 *
 * @returns Backend response confirming logout.
 */
export function logout() {
	return apiRequest(() => api.post(API_ROUTES.AUTH.LOGOUT))
}

/**
 * Authenticates a user using Google OAuth credentials.
 *
 * @param credentials - Google credential response token.
 * @returns Auth response containing user info and tokens.
 */
export function googleLogin(credentials: CredentialResponse) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.GOOGLE, credentials))
}

/**
 * Fetches all available expertise areas.
 * Used during onboarding and profile setup.
 *
 * @returns List of expertise categories from backend.
 */
export function fetchExpertiseAreas() {
	return apiRequest(() => api.get(API_ROUTES.EXPERTISE.FETCH))
}

/**
 * Saves selected user interests or expertise areas.
 *
 * @param data - Array or object containing selected expertise IDs.
 * @returns Backend response confirming saved interests.
 */
export function saveInterests(data: unknown) {
	return apiRequest(() => api.post(API_ROUTES.AUTH.ADD_INTERESTS, data))
}
