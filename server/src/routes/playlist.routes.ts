import { Router } from "express";
import { generatePlaylistHandler } from "../controllers/playlist.controller";
import { generatePlaylistLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post(
  "/generate-playlist",
  generatePlaylistLimiter,
  generatePlaylistHandler
);

export default router;