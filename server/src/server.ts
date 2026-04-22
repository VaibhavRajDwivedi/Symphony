import "dotenv/config";
import { env } from "./config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import authGoogleRoutes from "./routes/auth.google.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import recommendRoutes from "./routes/recommend.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startCleanupCron } from "./services/playlistCleanup.service.js";
import streamRoutes from "./routes/stream.routes.js";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
const CLIENT_URL = env.CLIENT_URL || "http://127.0.0.1:3000";

app.use(cookieParser());
app.use(
  cors({
    origin: [
      CLIENT_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/", (_, res) => {
  res.json({ status: "Symphony API is running 🎵" });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth/google", authGoogleRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api", playlistRoutes);
app.use("/api", recommendRoutes);
app.use("/api/stream", streamRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(env.PORT, () => {
  console.log(`🚀 Symphony server running on http://127.0.0.1:${env.PORT}`);
  startCleanupCron();
  console.log(`   Auth:      http://127.0.0.1:${env.PORT}/api/auth/login`);
  console.log(`   Status:    http://127.0.0.1:${env.PORT}/api/auth/status`);
  console.log(`   Generate:  http://127.0.0.1:${env.PORT}/api/generate-playlist`);
  console.log(`   Recommend: http://127.0.0.1:${env.PORT}/api/recommend`);
});