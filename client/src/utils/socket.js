
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("🔐 No token found. Socket not connected.");
    return;
  }

  socket = io("http://localhost:8000", {
    withCredentials: true,
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log(" Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log(" Socket disconnected");
  });
};

export const getSocket = () => socket;
