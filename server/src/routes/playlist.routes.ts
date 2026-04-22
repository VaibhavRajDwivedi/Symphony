import { Router } from "express";
import { generatePlaylistHandler } from "../controllers/playlist.controller.js";
import { generatePlaylistLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/generate-playlist",
  generatePlaylistLimiter,
  generatePlaylistHandler
);

export default router;