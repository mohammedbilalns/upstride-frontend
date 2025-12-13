import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { fetchFollowingResponse, fetchFollowersResponse, RecentActivityResponse } from "@/shared/types/connection";
import { apiRequest } from "@/shared/utils/apiWrapper";

//------------
// Queries
//------------

// export async function fetchFolowers(page: number, limit: number) {
//   try {
//     const response = await api.get<fetchFollowersResponse>(API_ROUTES.CONNECTIONS.FETCH_FOLLOWERS, {
//       params: { page, limit },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("error while fetching followers", error);
//     throw error;
//   }
// }

// export async function fetchFollowing(page: number, limit: number) {
//   try {
//     const response = await api.get<fetchFollowingResponse>(API_ROUTES.CONNECTIONS.FETCH_FOLLOWING, {
//       params: { page, limit },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("error while fetching following", error);
//     throw error;
//   }
// }

// export async function fetchRecentActivity() {
//   try {
//     const response = await api.get<RecentActivityResponse>(API_ROUTES.CONNECTIONS.RECENT_ACTIVITY);
//     return response.data;
//   } catch (error) {
//     console.error("error while fetching recent activity", error);
//     throw error;
//   }
// }

// export async function fetchSuggestedMentors(page?: number, limit?: number) {
//   try {
//     const response = await api.get(API_ROUTES.CONNECTIONS.SUGGGESTED, {
//       params: { page, limit },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("error while fetching suggested mentors", error);
//     throw error;
//   }
// }

// export async function fetchMutualConnections() {
//   try {
//     const response = await api.get(API_ROUTES.CONNECTIONS.MUTUAL);
//     return response.data;
//   } catch (error) {
//     console.error("error while fetching mutual connections", error);
//     throw error;
//   }
// }

export function fetchFollowers(page: number, limit: number) {
  return apiRequest(() => api.get<fetchFollowersResponse>(API_ROUTES.CONNECTIONS.FETCH_FOLLOWERS, {
    params: { page, limit },
  }));
}

export function fetchFollowing(page: number, limit: number) {
  return apiRequest(() => api.get<fetchFollowingResponse>(API_ROUTES.CONNECTIONS.FETCH_FOLLOWING, {
    params: { page, limit },
  }));
}

export function fetchRecentActivity() {
  return apiRequest(() => api.get<RecentActivityResponse>(API_ROUTES.CONNECTIONS.RECENT_ACTIVITY));
}

export function fetchSuggestedMentors(page?: number, limit?: number) {
  return apiRequest(() => api.get(API_ROUTES.CONNECTIONS.SUGGGESTED, {
    params: { page, limit },
  }));
}

export function fetchMutualConnections() {
  return apiRequest(() => api.get(API_ROUTES.CONNECTIONS.MUTUAL));
}

//------------------
// Mutations
//------------------
// export async function followMentor(mentorId: string) {
//   try {
//     const response = await api.post(API_ROUTES.CONNECTIONS.FOLLOW, {
//       mentorId,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("error while following mentor", error);
//     throw error;
//   }
// }

// export async function unfollowMentor(mentorId: string) {
//   try {
//     const response = await api.post(API_ROUTES.CONNECTIONS.UNFOLLOW, {
//       mentorId,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("error while unfollowing mentor", error);
//     throw error;
//   }
// }

export function followMentor(mentorId: string) {
  return apiRequest(() => api.post(API_ROUTES.CONNECTIONS.FOLLOW, { mentorId }));
}

export function unfollowMentor(mentorId: string) {
  return apiRequest(() => api.post(API_ROUTES.CONNECTIONS.UNFOLLOW, { mentorId }));
}
