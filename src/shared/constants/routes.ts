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
		GET_USERS: "/auth/me",
	},
	USERMANAGEMENT: {
		USERS: "/users",
		BLOCK: (id: string) => `/users/block/${id}`,
		UNBLOCK: (id: string) => `/users/unblock/${id}`,
	},
	EXPERTISE: {
		CREATE: "/expertise/",
		FETCH: "/expertise",
		ACTIVE: "/expertise/active",
		UPDATE: (id: string) => `/expertise/${id}`,
		VERIFY: (id: string) => `/expertise/${id}/verify`,
		CREATE_SKILL: (id: string) => `/expertise/${id}/skills`,
		UPDATE_SKILL: (id: string) => `/expertise/skills/${id}`,
		VERIFY_SKILL: (id: string) => `/expertise/skills/${id}/verify`,
		FETCH_SKILLS: (id: string) => `/expertise/${id}/skills`,
		FETCH_SKILLS_BY_AREAS: "/expertise/skills",
	},
	MENTOR: {
		FETCH: "/mentor",
		FETCH_MENTOR_DETAILS: "/mentor/details",
		UPDATE: "/mentor",
		CREATE: "/mentor",
		APPROVE: `/mentor/approve`,
		REJECT: `/mentor/reject`,
		FETCH_MENTORS_FOR_USER: "/mentor/user",
	},
	ARTICLES: {
		ARTICLES: "/articles",
		CREATE: "/articles",
		FETCH: (id: string) => `/articles/${id}`,
		UPDATE: `/articles`,
		DELETE: (id: string) => `/articles/${id}`,
		READ: (id: string) => `/articles/${id}`,
		ARTICLES_BY_CATEGORY: "/articles/by-category",
	},
	TAGS: {
		FETCH_MOST_USED: "/tags/most-used",
	},
	MEDIA: {
		GENERATE_TOKEN: "/media/generate-signature",
		SAVE_MEDIA: "/media/save-media",
		DELETE: (id: string, mediaType: string) => `/media/${id}/${mediaType}`,
	},
	REACT: {
		REACT_RESOURCE: "/reactions",
		GET_REACTIONS: "/reactions",
	},
	COMMENT: {
		BASE: "/comments",
	},
	PROFILE: {
		FETCH: (id: string) => `/profile/${id}`,
		UPDATE: "/profile",
		UPDATE_PASSWORD: "/profile/change-password",
	},
	NOTIFICATIONS: {
		MARK_READ: (notificationId: string) => `/notifications/${notificationId}`,
		MARK_ALL_AS_READ: "/notifications/mark-all",
		FETCH: "/notifications",
	},
	CONNECTIONS: {

		FOLLOW: "/connection/follow",
		FETCH_FOLLOWERS: "/connection/followers",
		FETCH_FOLLOWING: "/connection/following",
		UNFOLLOW: "/connection/unfollow",
		RECENT_ACTIVITY: "/connection/recent-activity"
	}
};
