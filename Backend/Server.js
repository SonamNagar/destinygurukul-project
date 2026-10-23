import http from "http";
import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import dotenv from "dotenv/config";
import mongoose from "mongoose";
import { Server as SocketServer } from "socket.io";

import connectDb from "./config/db.js";
import tutorRoutes from "./routes/tutorRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
  xssSanitize,
  mongoSanitizeMiddleware,
} from "./middleware/sanitizeMiddleware.js";

const app = express();
const httpServer = http.createServer(app);

// =========================
// CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173",
  "https://destinygurukul-project-frontend.onrender.com"
];
// =========================
// REAL-TIME WEBSOCKETS (Socket.io)
// =========================
const io = new SocketServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation for Socket.io"));
      }
    },
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket client connected:", socket.id);

  // User joins their private room by email
  socket.on("join_user_room", (email) => {
    if (email && typeof email === "string") {
      const sanitizedEmail = email.toLowerCase().trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
        const room = `user_${sanitizedEmail}`;
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket client disconnected:", socket.id);
  });
});

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// =========================
// SECURITY HEADERS (Helmet)
// =========================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
  })
);

// =========================
// REQUEST BODY PARSING & LIMITS
// =========================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// =========================
// STATIC UPLOADS FOLDER
// =========================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// =========================
// DATA SANITIZATION (NoSQL Injection & XSS & HPP)
// =========================
app.use(mongoSanitizeMiddleware);
app.use(hpp());
app.use(xssSanitize);

// =========================
// START SERVER AFTER DB CONNECTION
// =========================
const PORT = process.env.PORT;

const startServer = async () => {
  // Connect to MongoDB FIRST (with retries)
  await connectDb();

  // =========================
  // API ROUTES (only after DB is connected)
  // =========================
  app.use("/api/tutors", tutorRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/payments", paymentRoutes);

  // Root route / Health check
  app.get("/", (req, res) => {
    res.json({
      status: "success",
      message: "Destiny Gurukul Backend API is secure, real-time enabled, and running.",
      version: "2.0.0",
      dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      dbReadyState: mongoose.connection.readyState,
      features: [
        "Authentication & JWT Refresh Flow",
        "Forgot/Reset Password System",
        "Multer Image Uploads",
        "Razorpay Payment Gateway",
        "Socket.io Real-Time Notifications",
        "Ratings & Reviews System",
      ],
      timestamp: new Date().toISOString(),
    });
  });

  // =========================
  // ERROR HANDLING MIDDLEWARE
  // =========================
  app.use(notFound);
  app.use(errorHandler);

  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Socket.io is active and listening`);
  });
};

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});

export { app, io, httpServer };
