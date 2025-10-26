import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { registerSocketEventHandlers } from "@/app/sockets";
import { useAuthStore } from "./auth.store";

interface SocketState {
	socket: Socket | null;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}
// NOTE: Used optional chaining to avoid type errors

export const useSocketStore = create<SocketState>((set, get) => ({
	socket: null,
	connect: () => {
		try {
			const { isLoggedIn } = useAuthStore.getState();
			const { socket } = get();

			if (!isLoggedIn) return;
			if (socket?.connected) return;

			const newSocket = io(import.meta.env.VITE_SERVER_URL, {
				transports: ["websocket"],
				withCredentials: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 2000,
			});

			newSocket.on("connect", () => console.log("ws connected", newSocket.id));
			newSocket.on("disconnect", () => console.log("ws disconnected"));
			newSocket.on("connect_error", (err) => {
				console.error("[WS] Connection error:", err.message, err);
			});

			registerSocketEventHandlers(newSocket);

			set({ socket: newSocket });
		} catch (error) {
			console.log("[WS] Connection failed", error);
		}
	},
	disconnect: () => {
		const sock = get().socket;
		if (sock) {
			sock.removeAllListeners();
			if (sock.connected) sock.disconnect();
		}
		set({ socket: null });
	},

	reconnect: () => {
		get().disconnect();
		get().connect();
	},
}));
