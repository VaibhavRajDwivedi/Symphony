import type { Request, Response, NextFunction } from "express";
import { runRecommendPipeline } from "../services/recommend.service";

// ─── Request body shape ───────────────────────────────────────────────────────

interface RecommendBody {
  prompt: string;
  sourceUrl?: string;
  userId?: string;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

/**
 * POST /api/recommend
 *
 * Accepts a natural-language prompt and runs the full 6-stage AI pipeline:
 * Intent → Seeds → Last.fm Expansion → Curation → Spotify Search → Playlist.
 *
 * This can take 15–40 s end-to-end (3 Gemini calls + N Last.fm requests +
 * M Spotify searches), so the client should show a meaningful loading state.
 */
export async function recommendHandler(
  req: Request<{}, {}, RecommendBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { prompt, sourceUrl, userId } = req.body;

    // Performs basic validation to prevent unnecessary execution of the expensive pipeline.
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: "A non-empty 'prompt' string is required.",
      });
      return;
    }

    // Guards against overly long prompts to mitigate excessive token costs.
    if (prompt.trim().length > 1000) {
      res.status(400).json({
        success: false,
        error: "Prompt must be 1000 characters or fewer.",
      });
      return;
    }

    console.log(`[API] /recommend — prompt received (${prompt.length} chars)`);

    const result = await runRecommendPipeline(prompt.trim(), sourceUrl, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    // Passes error to global errorHandler for logging and response formatting.
    next(err);
  }
}
