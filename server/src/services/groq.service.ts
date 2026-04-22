import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

/**
 * Returns a JSON object from Groq using the Llama 3.3 70B model.
 */
export async function getGroqCompletion<T>(
  prompt: string,
  systemPrompt: string = "You are a helpful assistant that always responds in valid JSON."
): Promise<T> {
  try {
    // Groq's json_object mode requires the word "json" in the system prompt.
    const safeSystemPrompt = systemPrompt.toLowerCase().includes("json")
      ? systemPrompt
      : `${systemPrompt} Respond strictly in JSON format.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: safeSystemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    let rawContent = chatCompletion.choices[0]?.message?.content || "{}";

    // DEBUG: Log exactly what Groq is returning
    console.log(`[Groq Raw Response]:\n${rawContent}\n`);

    // ROBUST PARSING: Strips markdown formatting if added by Groq
    rawContent = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(rawContent) as T;
  } catch (err: any) {
    console.error("[Groq Error] API call failing:", err.message);
    throw new Error(`Groq API failed: ${err.message}`);
  }
}

