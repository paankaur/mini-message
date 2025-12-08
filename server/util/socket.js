let io = null;

export async function initSocket(server) {
  // lazy import to avoid adding a runtime dependency if not used
  const { Server } = await import("socket.io");
  const allowed = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*";

  io = new Server(server, {
    cors: {
      origin: allowed,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
