import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import { registerSocketEventHandlers } from "@/sockets";
import { useAuthStore } from "./auth.store";

interface SocketState {
	socket: Socket | null;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}

// Fix the useSocketStore
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connect: () => {
    try {
      const { isLoggedIn } = useAuthStore.getState();
      const { socket } = get();

      if (!isLoggedIn) return;
      if (socket && socket.connected) return;

      // Disconnect existing socket if any
      if (socket) socket.disconnect();

      const newSocket = io(import.meta.env.VITE_SERVER_URL, {
        transports: ["websocket"],
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      newSocket.on("connect", () => console.log("ws connected", newSocket.id));
      newSocket.on("disconnect", () => console.log("ws disconnected"));
      newSocket.on(SOCKET_EVENTS.NOTIFICATION.NEW, (data) => {
        console.log("new notification", data);
      });
      newSocket.on("connect_error", (err) => {
        console.error("[WS] Connection error:", err.message, err);
      });
      newSocket.onAny((event, ...args) => {
        console.log(`[WS] Event received: ${event}`, args);
      });
      
      set({ socket: newSocket });
    } catch (error) {
      console.log("[WS] Connection failed", error);
    }
  },
  disconnect: () => {
    const sock = get().socket;
    if (sock && sock.connected) sock.disconnect();
    set({ socket: null });
  },
  reconnect: () => {
    get().disconnect();
    get().connect(); 
  },
}));