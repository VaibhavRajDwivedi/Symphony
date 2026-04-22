import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";
import type { ResolvedTrack } from "../types";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export async function generateVibeCheck(
  tracks: ResolvedTrack[],
  prompt?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: { temperature: 0.95, topP: 0.99, topK: 40 },
  });

  const trackList = tracks
    .slice(0, 15)
    .map((t) => `"${t.title}" by ${t.artist}`)
    .join(", ");

  const context = prompt
    ? `The user asked for: "${prompt}".`
    : "The user uploaded a screenshot of their music queue.";

  const vibePrompt =
    `You are a witty, slightly roast-y music taste analyst. ` +
    `${context} ` +
    `Their playlist contains: ${trackList}. ` +
    `Write EXACTLY 2 sentences analyzing their music taste. ` +
    `Be specific, clever, and reference actual songs or artists from the list. ` +
    `Be funny but not mean. No emojis. No generic statements. ` +
    `Example style: "You clearly cry in the shower and call it self-care. ` +
    `Your Spotify Wrapped is just The 1975 on repeat." ` +
    `Return ONLY the 2 sentences, nothing else.`;

  const result = await model.generateContent(vibePrompt);
  const text = result.response.text().trim();

  console.log(`[VibeCheck] ✅ Generated vibe check.`);
  return text;
}