
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import type { Track } from "../types/index.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const EXTRACTION_PROMPT = `
You are a precise music data extraction AI. Your only job is to extract song information from the provided screenshot.

STRICT RULES:
1. Extract ONLY the official track title and the original artist name.
2. IGNORE all UI elements: timestamps, battery %, play buttons, progress bars, album art, follower counts, playlist names, duration, BPM, queue labels.
3. Do NOT include: "Live", "Remastered", "Cover", "Tribute", "Karaoke", "Instrumental", "Version", "Edit" — UNLESS these words are a confirmed, official part of the original studio release title.
4. If multiple artists are listed, include all of them exactly as shown (e.g. "Artist A, Artist B").
5. Return ONLY a valid JSON array. No explanation, no markdown, no code fences, no extra text.
6. If you cannot find any tracks, return an empty array: []

OUTPUT FORMAT (strictly follow this):
[
  { "title": "exact track title", "artist": "exact artist name" },
  { "title": "exact track title", "artist": "exact artist name" }
]
`;

export async function extractTracksFromImage(
  imageBase64: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp"
): Promise<Track[]> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      topK: 40,
    },
  });

  let result;
  try {
    result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      {
        text: EXTRACTION_PROMPT,
      },
    ]);
  } catch (err: any) {
    console.error("[Gemini Error] API call failing:", err.message);
    throw new Error("Gemini API call failed.");
  }

  const response = result.response;
  const rawText = response.text().trim();

  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  let tracks: Track[];
  try {
    tracks = JSON.parse(cleaned);
  } catch (err: any) {
    throw new Error("Gemini returned invalid JSON for image extraction.");
  }

  if (!Array.isArray(tracks)) {
    throw new Error("Gemini response was not an array.");
  }

  const validated = tracks.filter(
    (t) =>
      typeof t === "object" &&
      typeof t.title === "string" &&
      t.title.trim() !== "" &&
      typeof t.artist === "string" &&
      t.artist.trim() !== ""
  );

  if (validated.length === 0) {
    throw new Error("No tracks could be extracted from this image.");
  }

  return validated;
}

/**
 * Returns a JSON object from Gemini for text completion.
 */
export async function getGeminiCompletion<T>(
  prompt: string,
  temperature: number = 0.7
): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { temperature, topP: 0.95, topK: 40 },
  });

  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (err: any) {
    console.error("[Gemini Text Error] API call failing:", err.message);
    throw new Error("Gemini text generation failed.");
  }
}