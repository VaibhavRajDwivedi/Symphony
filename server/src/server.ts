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

app.set("trust proxy", 1);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cookieParser());
app.use(
  cors({
    origin: [env.CLIENT_URL],
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
  console.log(`🚀 Symphony server running on ${env.API_URL}`);
  startCleanupCron();
  console.log(`   Auth:      ${env.API_URL}/api/auth/login`);
  console.log(`   Status:    ${env.API_URL}/api/auth/status`);
  console.log(`   Generate:  ${env.API_URL}/api/generate-playlist`);
  console.log(`   Recommend: ${env.API_URL}/api/recommend`);
});