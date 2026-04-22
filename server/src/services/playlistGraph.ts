import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { env } from "../config/env";
import { getGroqCompletion } from "./groq.service";
import { getGeminiCompletion } from "./gemini.service";
import type { GeminiSong } from "./lastfm.service";

// Helper function to call the AI directly (prevents circular dependency with recommend.service.ts)
async function graphCallAI<T>(prompt: string, temperature: number = 0.7, systemPrompt?: string): Promise<T> {
  if (env.AI_PROVIDER === "groq") {
    // Groq requires a system prompt, defaulting to JSON strictness
    return getGroqCompletion<T>(prompt, systemPrompt || "You are a helpful AI. Respond strictly in JSON.");
  } else {
    return getGeminiCompletion<T>(prompt, temperature);
  }
}

// Define the State using Annotation.Root (LangGraph v0.2.x)
export const PlaylistStateAnnotation = Annotation.Root({
  prompt: Annotation<string>(),
  draftTracks: Annotation<GeminiSong[]>({
    reducer: (state, update) => update,
    default: () => [],
  }),
  feedback: Annotation<string>({
    reducer: (state, update) => update,
    default: () => "",
  }),
  attempts: Annotation<number>({
    reducer: (state, update) => state + update,
    default: () => 0,
  }),
});

export type PlaylistState = typeof PlaylistStateAnnotation.State;

// Node 1: Generate the Playlist
async function generatePlaylistNode(state: PlaylistState) {
  let finalPrompt = state.prompt;
  
  if (state.feedback && state.feedback !== "PASS") {
    finalPrompt += `\n\nFEEDBACK FROM PREVIOUS ATTEMPT (Fix this): ${state.feedback}`;
  }

  const systemPrompt = "You are a world-class music curator. Return only valid JSON. If using Groq, return an object with a 'songs' key containing the array.";
  
  console.log(`[LangGraph] Generator Node on attempt ${state.attempts + 1}`);
  
  // Call AI
  const response = await graphCallAI<any>(finalPrompt, 0.85, systemPrompt);
  
  const songs = Array.isArray(response) ? response : (response.songs || response.tracks || []);

  const validated = songs
    .filter(
      (s: any) =>
        s &&
        typeof s.title === "string" &&
        typeof s.artist === "string" &&
        s.title.trim() !== "" &&
        s.artist.trim() !== ""
    )
    .map((s: any) => ({ ...s, confidence: Math.min(1, Math.max(0, s.confidence ?? 0.5)) }));

  // Returns "1" for the `attempts` reducer because it performs `state + update`
  return { draftTracks: validated, attempts: 1 };
}

// Node 2: Evaluate the Playlist
async function evaluatePlaylistNode(state: PlaylistState) {
  console.log(`[LangGraph] Evaluator Node assessing ${state.draftTracks.length} tracks`);
  
  if (state.draftTracks.length !== 25) {
    return { feedback: `You generated ${state.draftTracks.length} tracks. I need EXACTLY 25 songs. Try again and literally verify the count.` };
  }
  
  return { feedback: "PASS" };
}

// Route based on feedback
function routeBasedOnEvaluation(state: PlaylistState) {
  if (state.feedback === "PASS") {
    console.log("[LangGraph] Evaluation passed!");
    return END;
  }
  
  if (state.attempts >= 3) {
    console.log("[LangGraph] Reached max attempts (3). Force progressing to salvage workflow.");
    return END;
  }
  
  console.log(`[LangGraph] Evaluation failed: ${state.feedback}. Routing back to Generator.`);
  return "Generator";
}

// Stitch and Compile
const workflow = new StateGraph(PlaylistStateAnnotation)
  .addNode("Generator", generatePlaylistNode)
  .addNode("Evaluator", evaluatePlaylistNode)
  .addEdge(START, "Generator")
  .addEdge("Generator", "Evaluator")
  .addConditionalEdges("Evaluator", routeBasedOnEvaluation);

export const playlistAgent = workflow.compile();

// ─── Remix Agent ──────────────────────────────────────────────────────────────

export const RemixStateAnnotation = Annotation.Root({
  tracks: Annotation<any[]>({
    reducer: (state, update) => update,
    default: () => [],
  }),
  prompt: Annotation<string>(),
  draftIds: Annotation<string[]>({
    reducer: (state, update) => update,
    default: () => [],
  }),
  feedback: Annotation<string>({
    reducer: (state, update) => update,
    default: () => "",
  }),
  attempts: Annotation<number>({
    reducer: (state, update) => state + update,
    default: () => 0,
  }),
});

export type RemixState = typeof RemixStateAnnotation.State;

async function generateRemixNode(state: RemixState) {
  let finalPrompt = `Here are the tracks:\n${JSON.stringify(state.tracks)}\n\nThe user wants: ${state.prompt}\n\nReturn a valid JSON array containing ONLY the string IDs of the tracks that match this vibe. Maximum 100 IDs.`;
  
  if (state.feedback && state.feedback !== "PASS") {
    finalPrompt += `\n\nFEEDBACK FROM PREVIOUS ATTEMPT (Fix this): ${state.feedback}`;
  }

  const systemPrompt = "You are a world-class music curator. Return only a valid JSON array of string IDs. If using Groq, return an object with an 'ids' key containing the array.";
  
  console.log(`[LangGraph Remix] Generator Node on attempt ${state.attempts + 1}`);
  
  const response = await graphCallAI<any>(finalPrompt, 0.5, systemPrompt);
  
  let ids: string[] = [];
  if (Array.isArray(response)) {
    ids = response;
  } else if (response.ids && Array.isArray(response.ids)) {
    ids = response.ids;
  } else if (response.tracks && Array.isArray(response.tracks)) {
    ids = response.tracks;
  }

  const draftIds = ids.map((id: any) => String(id));

  return { draftIds, attempts: 1 };
}

async function evaluateRemixNode(state: RemixState) {
  console.log(`[LangGraph Remix] Evaluator Node assessing ${state.draftIds.length} tracks`);
  
  if (!Array.isArray(state.draftIds) || state.draftIds.length === 0) {
    return { feedback: "The output must be a valid JSON array of strings containing at least 1 ID." };
  }
  
  if (state.draftIds.length > 100) {
    return { feedback: `You generated ${state.draftIds.length} IDs. Maximum allowed is 100 IDs.` };
  }
  
  return { feedback: "PASS" };
}

function routeRemixBasedOnEvaluation(state: RemixState) {
  if (state.feedback === "PASS") {
    console.log("[LangGraph Remix] Evaluation passed!");
    return END;
  }
  
  if (state.attempts >= 3) {
    console.log("[LangGraph Remix] Reached max attempts (3). Force progressing to salvage workflow.");
    return END;
  }
  
  console.log(`[LangGraph Remix] Evaluation failed: ${state.feedback}. Routing back to Generator.`);
  return "RemixGenerator";
}

const remixWorkflow = new StateGraph(RemixStateAnnotation)
  .addNode("RemixGenerator", generateRemixNode)
  .addNode("RemixEvaluator", evaluateRemixNode)
  .addEdge(START, "RemixGenerator")
  .addEdge("RemixGenerator", "RemixEvaluator")
  .addConditionalEdges("RemixEvaluator", routeRemixBasedOnEvaluation);

export const remixAgent = remixWorkflow.compile();