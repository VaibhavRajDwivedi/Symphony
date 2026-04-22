import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { env } from "../config/env";
import { getAccessToken } from "./spotifyAuth.service";
import type { ResolvedTrack } from "../types";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// ─── Generate image prompt from playlist context ───────────────────────────────

async function generateImagePrompt(
  playlistName: string,
  tracks: ResolvedTrack[],
  mood?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: { temperature: 0.9 },
  });

  const artists = [...new Set(tracks.slice(0, 5).map((t) => t.artist))].join(", ");

  const result = await model.generateContent(
    `You are an album art director. Create a detailed image generation prompt for a playlist. ` +
    `Playlist name: "${playlistName}". ` +
    `Artists: ${artists}. ` +
    `Mood: ${mood ?? "mixed"}. ` +
    `Rules: ` +
    `1. Abstract or atmospheric — no people, no text, no logos. ` +
    `2. Square composition. ` +
    `3. Describe colors, textures, lighting, mood. ` +
    `4. Max 2 sentences. ` +
    `5. Return ONLY the prompt text, nothing else.`
  );

  return result.response.text().trim();
}

// ─── Generate image using Gemini Imagen ───────────────────────────────────────

async function generateCoverImage(imagePrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 1,
      // @ts-ignore — responseModalities is supported but not yet in types
      responseModalities: ["image", "text"],
    },
  });

  const result = await model.generateContent(
    `Generate a square album cover art image. ${imagePrompt}. ` +
    `Style: modern, aesthetic, no text, no people.`
  );

  const parts = result.response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    // @ts-ignore
    if (part.inlineData?.mimeType?.startsWith("image/")) {
      // @ts-ignore
      return part.inlineData.data as string; // base64
    }
  }

  throw new Error("Gemini did not return an image.");
}

// ─── Convert base64 PNG → JPEG and resize to < 256KB ─────────────────────────

async function convertToSpotifyJpeg(base64: string): Promise<string> {
  // Spotify requires: base64 encoded JPEG, max 256KB
  // Trusts Gemini to return a reasonably sized image.
  // Returns as-is if already JPEG-compatible base64.
  // For production, run this through sharp/jimp.
  return base64;
}

// ─── Upload cover to Spotify ──────────────────────────────────────────────────

async function uploadCoverToSpotify(
  playlistId: string,
  base64Jpeg: string
): Promise<void> {
  const accessToken = await getAccessToken();

  await axios.put(
    `https://api.spotify.com/v1/playlists/${playlistId}/images`,
    base64Jpeg,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "image/jpeg",
      },
    }
  );

  console.log(`[CoverArt] ✅ Uploaded cover to playlist ${playlistId}`);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateAndUploadCoverArt(
  playlistId: string,
  playlistName: string,
  tracks: ResolvedTrack[],
  mood?: string
): Promise<void> {
  try {
    console.log("[CoverArt] Generating image prompt...");
    const imagePrompt = await generateImagePrompt(playlistName, tracks, mood);

    console.log("[CoverArt] Generating cover art with Gemini...");
    const base64 = await generateCoverImage(imagePrompt);

    const jpeg = await convertToSpotifyJpeg(base64);
    await uploadCoverToSpotify(playlistId, jpeg);
  } catch (err: any) {
    // Cover art is non-critical — log but don't throw
    console.error("[CoverArt] Failed (non-critical):", err.message);
  }
}