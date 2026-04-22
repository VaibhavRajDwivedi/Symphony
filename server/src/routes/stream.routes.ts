import { Router } from "express";
import {
  streamGeneratePlaylist,
  streamRecommendPlaylist,
} from "../controllers/stream.controller.js";
import { generatePlaylistLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/generate", generatePlaylistLimiter, streamGeneratePlaylist);
router.post("/recommend", generatePlaylistLimiter, streamRecommendPlaylist);

export default router;