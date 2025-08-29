export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    VERIFY_OTP: "/auth/verify-otp",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESEND_REGISTER_OTP: "/auth/resend-otp",
    RESET_PASSWORD: "/auth/reset-password",
    RESEND_RESET_OTP: "/auth/resend-reset-otp",
    UPDATE_PASSWORD: "/auth/update-password",
    GOOGLE: "/auth/google",
    REFRESH: "/auth/refresh",
  },
  USERMANAGEMENT: {
    USERS: "/users",
    BLOCK: (id: string) => `/users/block/${id}`,
    UNBLOCK: (id: string) => `/users/unblock/${id}`,
  },
};
