import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import api from "@/api/api";
import { useAuthStore } from "@/app/store/auth.store";
import { useSocketStore } from "@/app/store/socket.store";
import { API_ROUTES } from "@/shared/constants/routes";

export function useCurrentUser() {
	const { setUser, clearUser, isLoggedIn } = useAuthStore((state) => state);
	const { connect, disconnect } = useSocketStore();

	const hasHandledError = useRef(false);

	const handleConnect = useCallback(() => {
		const { socket } = useSocketStore.getState();
		if (!socket || !socket.connected) {
			connect();
		}
	}, [connect]);

	const handleDisconnect = useCallback(() => {
		disconnect();
	}, [disconnect]);

	const query = useQuery({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const response = await api.get(API_ROUTES.AUTH.GET_USERS);
			return response.data.user;
		},
		retry: false,
		staleTime: 0,
		enabled: isLoggedIn,
	});

	useEffect(() => {
		if (query.isSuccess && query.data) {
			hasHandledError.current = false;
			setUser(query.data);
			handleConnect();
		} else if (query.isError && !hasHandledError.current) {
			hasHandledError.current = true;
			clearUser();
			handleDisconnect();
		}
	}, [
		query.isSuccess,
		query.isError,
		query.data,
		clearUser, // NOTE: This is a hack to fix the linter error
		setUser,
		handleConnect,
		handleDisconnect,
	]);

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (isLoggedIn) handleDisconnect();
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [handleDisconnect, isLoggedIn]);

	return query;
}
