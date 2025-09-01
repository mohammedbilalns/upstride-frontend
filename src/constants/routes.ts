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
		ADD_INTERESTS: "/auth/add-interests",


  },
  USERMANAGEMENT: {
    USERS: "/users",
    BLOCK: (id: string) => `/users/block/${id}`,
    UNBLOCK: (id: string) => `/users/unblock/${id}`,
  },
  EXPERTISE: {
    CREATE: "/expertise/",
    FETCH: "/expertise",
    UPDATE: (id: string) => `/expertise/${id}`,
    VERIFY: (id: string) => `/expertise/${id}/verify`,
    CREATE_SKILL: (id: string) => `/expertise/${id}/skills`,
    UPDATE_SKILL: (id: string) => `/expertise/skills/${id}`,
    VERIFY_SKILL: (id: string) => `/expertise/skills/${id}/verify`,
    FETCH_SKILLS: (id: string) => `/expertise/${id}/skills`,
		FETCH_SKILLS_BY_AREAS: "/expertise/skills",
  },
};
