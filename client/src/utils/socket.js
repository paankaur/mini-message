import { io } from "socket.io-client";

let socket = null;

export function connectSocket(serverUrl, userId) {
  if (socket) return socket;
  const envSocket = import.meta.env.VITE_SOCKET_URL;
  const envApi = import.meta.env.VITE_API_URL;
  const server = serverUrl || envSocket || envApi || "http://localhost:3000";
  socket = io(server, { transports: ["websocket"] });
  socket.on("connect", () => {
    if (userId) {
      socket.emit("join", userId);
    }
  });
  return socket;
}

export function getSocket() {
  return socket;
}
