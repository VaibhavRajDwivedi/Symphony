import type { Request, Response, NextFunction } from "express";
import { extractTracksFromImage } from "../services/gemini.service.js";
import { generatePlaylist } from "../services/spotifyPlaylist.service.js";
import type { GeneratePlaylistBody } from "../types/index.js";

export async function generatePlaylistHandler(
  req: Request<{}, {}, GeneratePlaylistBody>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64 || !mimeType) {
      res.status(400).json({
        success: false,
        error: "imageBase64 and mimeType are required.",
      });
      return;
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(mimeType)) {
      res.status(400).json({
        success: false,
        error: "Invalid mimeType. Must be image/jpeg, image/png, or image/webp.",
      });
      return;
    }

    // Phase 2: Extract tracks from image using Gemini
    console.log("[API] Extracting tracks from image...");
    const tracks = await extractTracksFromImage(imageBase64, mimeType);

    // Phase 3: Search Spotify + create playlist
    console.log(`[API] Generating playlist for ${tracks.length} tracks...`);
    const result = await generatePlaylist(tracks);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}