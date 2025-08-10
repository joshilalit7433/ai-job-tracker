import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import connectdb from "./utils/db";
import userRoute from "./routes/user.route";
import JobApplicationRoute from "./routes/jobApplication.route";
import ApplicantRoute from "./routes/applicant.route";
import NotificationRoute from "./routes/notification.route";
import RecruiterDashboardRoute from "./routes/recruiterDashboard.route";

// Load env variables
dotenv.config();

if (process.env.NODE_ENV === "production") {
  console.log = function () {};  
  console.debug = function () {}; 
}

// Validate required env variables
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is missing from .env");
}

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

// Connect to MongoDB
connectdb();

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job-application", JobApplicationRoute);
app.use("/api/v1/applicant", ApplicantRoute);
app.use("/api/v1/notifications", NotificationRoute);
app.use("/api/v1/recruiter", RecruiterDashboardRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Track sockets per user
const userSocketMap = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  const token = socket.handshake.auth?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userid: string };

      const userId = decoded.userid;

      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }

      userSocketMap.get(userId)!.add(socket.id);

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
  console.log(` Server running on http://localhost:${PORT}`);
});

export { io, userSocketMap };
