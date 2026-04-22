import { useRecommendStore } from "../store/useRecommendStore";
import { useChatStore } from "../store/useChatStore";
import api from "../lib/axios";
import type { ApiResponse } from "../types";
import type { RecommendResult } from "../store/useRecommendStore";

// ─── Stage progression timings ────────────────────────────────────────────────

/**
 * The pipeline operates as a single blocking HTTP call (~15-40 s), precluding
 * real per-stage callbacks from the server. Instead, status advances
 * through each stage on a timer to display meaningful progress rather
 * than a static spinner. Timers cancel immediately upon response
 * arrival (success or error), ensuring no stale stages display.
 *
 * Timings are conservative — reflecting the slowest realistic case to ensure
 * the UI does not outpace actual server execution.
 */
const STAGE_TIMINGS: Array<{ delayMs: number; message: string }> = [
  { delayMs: 0, message: "Parsing request..." },
  { delayMs: 5000, message: "Generating recommendations..." },
  { delayMs: 12000, message: "Expanding context..." },
  { delayMs: 19000, message: "Curating your list..." },
  { delayMs: 26000, message: "Searching Spotify..." },
  { delayMs: 33000, message: "Creating playlist..." },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRecommend() {
  const { setStatus, setError, setResult, setPrompt, reset } =
    useRecommendStore();

  const recommend = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    reset();
    setPrompt(trimmed);

    // Initiates all stage timers upfront and collects timer IDs for cleanup.
    const timerIds = STAGE_TIMINGS.map(({ delayMs, message }) =>
      setTimeout(() => setStatus("loading", message), delayMs)
    );

    const clearAllTimers = () => timerIds.forEach(clearTimeout);

    try {
      const { data } = await api.post<ApiResponse<RecommendResult>>(
        "/api/recommend",
        { prompt: trimmed },
        // Overrides default timeout as full pipeline may take up to 60 seconds.
        { timeout: 120_000 }
      );

      clearAllTimers();

      if (!data.success || !data.data) {
        throw new Error(data.error ?? "Failed to generate recommendation.");
      }

      setResult(data.data);

      useChatStore.getState().createChat({
        mode: "prompt",
        title: trimmed.slice(0, 30) + (trimmed.length > 30 ? "..." : ""),
        promptText: trimmed,
        playlistUrl: data.data.playlistUrl,
      });
    } catch (err) {
      clearAllTimers();
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return { recommend };
}
