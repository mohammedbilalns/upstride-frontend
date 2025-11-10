import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import api from "@/api/api";
import { useAuthStore } from "@/app/store/auth.store";
import { useSocketStore } from "@/app/store/socket.store";
import { API_ROUTES } from "@/shared/constants/routes";

/**
 * Hook to manage the currently authenticated user.
 * - Fetches current user data when logged in
 * - Syncs Zustand store state
 * - Manages socket connection lifecycle
 */

export function useCurrentUser() {
  const { setUser, clearUser, isLoggedIn } = useAuthStore((state) => state);
  const { connect, disconnect } = useSocketStore();

  // Prevents repeated error handling
  const hasHandledError = useRef(false);

  // Establish socket connection
  const handleConnect = useCallback(() => {
    const { socket } = useSocketStore.getState();
    if (!socket || !socket.connected) {
      connect();
    }
  }, [connect]);

  // Gracefully close socket connection
  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // Fetch the current logged-in user
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get(API_ROUTES.AUTH.GET_USERS);
      return response.data.user;
    },
    retry: false, // Don't retry if unauthorized 
    staleTime: 0,
    enabled: isLoggedIn, // Only fetch if logged in
  });

  // Handle user fetching
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
    clearUser,
    setUser,
    handleConnect,
    handleDisconnect,
  ]);

  // Ensures socket disconnects on browser/tab close
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

