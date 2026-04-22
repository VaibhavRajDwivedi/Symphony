import type { Request, Response } from "express";
import { SSEStream } from "../services/sse.service.js";
import { extractTracksFromImage } from "../services/gemini.service.js";
import { generatePlaylist } from "../services/spotifyPlaylist.service.js";
import { runRecommendPipeline } from "../services/recommend.service.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";


export async function streamGeneratePlaylist(
  req: Request,
  res: Response
): Promise<void> {
  const sse = new SSEStream(res);
  try {
    const { imageBase64, mimeType, userId } = req.body;

    if (!imageBase64 || !mimeType) {
      sse.error("imageBase64 and mimeType are required.");
      return;
    }

    sse.status(`Analyzing your screenshot with Gemini AI...`);
    const tracks = await extractTracksFromImage(imageBase64, mimeType);

    sse.status(`Found ${tracks.length} tracks! Searching Spotify...`);
    const result = await generatePlaylist(tracks);


    sse.status("Creating your playlist...");

    if (userId) {
      await prisma.chatSession.create({
        data: {
          userId,
          mode: "image",
          playlistUrl: result.playlistUrl,
          tracks: result.tracks as any,
          title: "Image Playlist",
        },
      });
    }

    sse.complete(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    sse.error(message);
  }
}

export async function streamRecommendPlaylist(
  req: Request,
  res: Response
): Promise<void> {
  const sse = new SSEStream(res);
  try {
    const { prompt, userId, sourceUrl } = req.body;

    if (!prompt?.trim()) {
      sse.error("Prompt is required.");
      return;
    }

    sse.status("Understanding your vibe...");

    const providerName = env.AI_PROVIDER.charAt(0).toUpperCase() + env.AI_PROVIDER.slice(1);
    const statusMessages = [
      "Parsing your mood...",
      `Generating song seeds with ${providerName}...`,
      "Expanding via Last.fm...",
      "Curating the best tracks...",
      "Searching Spotify...",
      "Almost there...",
    ];


    let msgIndex = 0;
    const statusInterval = setInterval(() => {
      if (msgIndex < statusMessages.length) {
        sse.status(statusMessages[msgIndex]!);
        msgIndex++;
      }
    }, 5000);

    const result = await runRecommendPipeline(prompt, sourceUrl, userId);
    clearInterval(statusInterval);

    if (userId) {
      await prisma.chatSession.create({
        data: {
          userId,
          mode: "prompt",
          promptText: prompt,
          playlistUrl: result.playlistUrl,
          tracks: result.tracks as any,
          title: result.playlistName,
        },
      });
    }

    sse.complete(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    sse.error(message);
  }
}