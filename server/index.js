import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectdb from "./utils/db.js";
import userRoute from "../server/routes/user.route.js";
import JobApplicationRoute from "../server/routes/jobApplication.route.js";
import ApplicantRoute from "../server/routes/applicant.route.js";
import NotificationRoute from "../server/routes/notification.route.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB connection
connectdb();

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job-application", JobApplicationRoute);
app.use("/api/v1/applicant", ApplicantRoute);
app.use("/api/v1/notifications", NotificationRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// HTTP & Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Track sockets per user
const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  const token = socket.handshake.auth?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.userid;

      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);

      console.log(` Mapped user ${userId} to socket ${socket.id}`);

      socket.on("disconnect", () => {
        const userSockets = userSocketMap.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            userSocketMap.delete(userId);
          }
        }
        console.log(` Disconnected user ${userId}`);
      });
    } catch (err) {
      console.log(" Invalid token in socket auth");
    }
  } else {
    console.log(" No token in socket auth");
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export { io, userSocketMap };
