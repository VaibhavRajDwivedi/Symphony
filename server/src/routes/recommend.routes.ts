import { Router } from "express";
import rateLimit from "express-rate-limit";
import { recommendHandler } from "../controllers/recommend.controller.js";

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

/**
 * Stricter than the image pipeline — this endpoint fires 3 Gemini calls,
 * ~25 Last.fm requests, and ~20 Spotify searches per invocation. 3 req/min
 * is more than enough for genuine interactive use while protecting API budgets.
 */
const recommendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many recommendation requests. Please wait a minute and try again.",
  },
});

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

// POST /api/recommend
router.post("/recommend", recommendLimiter, recommendHandler);

export default router;
