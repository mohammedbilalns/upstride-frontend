import {create} from "zustand"
import { io, type Socket } from "socket.io-client"
import { useAuthStore } from "./auth.store";

interface SocketState {
	socket: Socket | null;
	connect: () => void;
	disconnect: () => void;
	reconnect: () => void;
}


export const useSocketStore = create<SocketState>((set, get)=>({
	socket: null , 
	connect: () => {
		try{
			const {isLoggedIn} = useAuthStore.getState()
			if(!isLoggedIn) return
			if(get().socket?.connected) return; // already connected 

			const socket = io(import.meta.env.VITE_SERVER_URL,{
				transports:["websocket"],
				withCredentials: true,
				reconnectionAttempts:5,
				reconnectionDelay: 2000
			})

			socket.on("connect", ()=> console.log("ws connected", socket.id))
			socket.on("disconnect", ()=> console.log("ws disconnected"))
			socket.on("connect_error", (err) => {
				console.error("[WS] Connection error:", err.message, err);
			});
			socket.onAny((event, ...args) => {
				console.log(`[WS] Event received: ${event}`, args);
			});
			set({socket})
		}catch(error){
			console.log("[WS] Connection failed", error)
		}


	}, 
	disconnect: () => {
		const sock = get().socket;
		if(sock && sock.connected) sock.disconnect()
		set({socket:null })
	},

	reconnect: () => {
		get().disconnect()
		get().disconnect()

	}

})) 
