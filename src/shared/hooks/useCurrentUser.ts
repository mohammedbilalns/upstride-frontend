import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api/api";
import { useAuthStore } from "@/app/store/auth.store";
import { useSocketStore } from "@/app/store/socket.store";
import { API_ROUTES } from "@/shared/constants/routes";

export function useCurrentUser() {
	const { setUser, clearUser, isLoggedIn } = useAuthStore((state) => state);
	const { connect, disconnect } = useSocketStore();

	const query = useQuery({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const response = await api.get(API_ROUTES.AUTH.GET_USERS);
			return response.data.user;
		},
		retry: false,
		staleTime: 0,
	});

	// Manage socket connection based on user fetch status
	useEffect(() => {
		if (query.isSuccess && query.data) {
			setUser(query.data);
			const { socket } = useSocketStore.getState();
			if (!socket || !socket.connected) {
				connect();
			}
		} else if (query.isError) {
			clearUser();
			disconnect();
		}
	}, [query.isSuccess, query.isError, query.data, connect, disconnect]);

	// Cleanup socket when window closes
	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isLoggedIn) disconnect();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [disconnect, isLoggedIn]);

	return query;
}
