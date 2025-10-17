import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api/api";
import { useAuthStore } from "@/app/store/auth.store";
import { API_ROUTES } from "@/shared/constants/routes";
import { useSocketStore } from "@/app/store/socket.store";

export function useCurrentUser() {

	const {setUser, clearUser, isLoggedIn} = useAuthStore.getState();
	const {connect, disconnect} = useSocketStore()


	const query = useQuery({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const response = await api.get(API_ROUTES.AUTH.GET_USERS);
			return response.data.user;
		},
		retry:false,
		staleTime: 0,
	});

	useEffect(() => {
		if (query.isSuccess && query.data) {
			setUser(query.data);
			connect();
		}
		if (query.isError) {
			clearUser();
			disconnect();
		}
	}, [query.isSuccess, query.isError, query.data, setUser, clearUser,connect, disconnect]);

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isLoggedIn) disconnect();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [disconnect, isLoggedIn]);

	return query;
}
