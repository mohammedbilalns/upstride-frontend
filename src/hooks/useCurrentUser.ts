import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api/api";
import { API_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth.store";

export function useCurrentUser() {
	const setUser = useAuthStore((state) => state.setUser);
	const clearUser = useAuthStore((state) => state.clearUser);

	const query = useQuery({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const response = await api.get(API_ROUTES.AUTH.GET_USERS);
			return response.data.user;
		},
		staleTime: 0,
		gcTime: 0,
	});

	useEffect(() => {
		if (query.isSuccess && query.data) {
			setUser(query.data);
		}
		if (query.isError) {
			clearUser();
		}
	}, [query.isSuccess, query.isError, query.data, setUser, clearUser]);

	return query;
}
