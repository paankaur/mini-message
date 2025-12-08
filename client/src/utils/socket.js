import { io } from "socket.io-client";

let socket = null;

export function connectSocket(serverUrl, userId) {
  if (socket) return socket;
  const server = serverUrl || import.meta.env.VITE_API_URL || window.location.origin;
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
