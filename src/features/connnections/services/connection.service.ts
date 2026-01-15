import api from "@/api/api";
import { API_ROUTES } from "@/shared/constants/routes";
import type { fetchFollowingResponse, fetchFollowersResponse, RecentActivityResponse } from "@/shared/types/connection";
import { apiRequest } from "@/shared/utils/apiWrapper";
import { infiniteQueryOptions } from "@tanstack/react-query";


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


export function followMentor(mentorId: string) {
  return apiRequest(() => api.post(API_ROUTES.CONNECTIONS.FOLLOW, { mentorId }));
}

export function unfollowMentor(mentorId: string) {
  return apiRequest(() => api.post(API_ROUTES.CONNECTIONS.UNFOLLOW, { mentorId }));
}
//------------------
// Query Options
//------------------

export const followersQueryOptions = (limit: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["followers"],
    queryFn: ({ pageParam = 1 }) => fetchFollowers(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

export const followingQueryOptions = (limit: number = 10) =>
  infiniteQueryOptions({
    queryKey: ["following"],
    queryFn: ({ pageParam = 1 }) => fetchFollowing(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.length < limit) return undefined;
      return allPages.length + 1;
    },
  });
