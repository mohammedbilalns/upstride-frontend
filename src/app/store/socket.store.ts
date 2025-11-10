import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { registerSocketEventHandlers } from "@/app/sockets";
import { useAuthStore } from "./auth.store";
import { env } from "@/shared/constants/env";

interface SocketState {
	socket: Socket | null;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}

/**
 * Zustand store for managing WebSocket connections.
 * - Connects when the user is authenticated.
 * - Handles disconnects and reconnections gracefully.
 */
export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,

  /** Establish a socket connection if authenticated */
	connect: () => {
		try {
			const { isLoggedIn } = useAuthStore.getState();
			const { socket } = get();

			if (!isLoggedIn) return;
			if (socket?.connected) return;

			const newSocket = io(env.SERVER_URL, {
				transports: ["websocket"],
				withCredentials: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 2000,
			});

      // Connection events
			newSocket.on("connect", () => console.log("ws connected", newSocket.id));
			newSocket.on("disconnect", () => console.log("ws disconnected"));
			newSocket.on("connect_error", (err) => {
				console.error("[WS] Connection error:", err.message, err);
			});


      // Register app-level event listeners
			registerSocketEventHandlers(newSocket);

			set({ socket: newSocket });
		} catch (error) {
			console.log("[WS] Connection failed", error);
		}
	},

  /** Cleanly disconnect from the socket server */
	disconnect: () => {
		const sock = get().socket;
		if (sock) {
			sock.removeAllListeners();
			if (sock.connected) sock.disconnect();
		}
		set({ socket: null });
	},

  /** Reconnect by forcing a clean disconnect first */
	reconnect: () => {
		get().disconnect();
		get().connect();
	},
}));
