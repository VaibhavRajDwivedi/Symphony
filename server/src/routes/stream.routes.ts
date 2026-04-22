import { Router } from "express";
import {
  streamGeneratePlaylist,
  streamRecommendPlaylist,
} from "../controllers/stream.controller";
import { generatePlaylistLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/generate", generatePlaylistLimiter, streamGeneratePlaylist);
router.post("/recommend", generatePlaylistLimiter, streamRecommendPlaylist);

export default router;