import { create } from "zustand";
import type { Track, NotFoundTrack } from "../types";

// ─── Status ───────────────────────────────────────────────────────────────────

export type RecommendStatus =
  | "idle"
  | "loading" // Replaces granular states with unified status message
  | "success"
  | "error";

// ─── Result type ──────────────────────────────────────────────────────────────

export interface RecommendResult {
  playlistUrl: string;
  playlistId: string;
  playlistName: string;
  tracks: Track[];
  notFound: NotFoundTrack[];
  vibeCheck?: string | null; // Vibe check support
}

// ─── State & Actions ──────────────────────────────────────────────────────────

interface RecommendState {
  // ── State ──
  status: RecommendStatus;
  statusMessage: string | null; // Holds live SSE stream messages
  prompt: string;
  errorMessage: string | null;
  result: RecommendResult | null;
  vibeCheck: string | null; // Holds final analysis

  // ── Actions ──
  setPrompt: (prompt: string) => void;
  // Function signature accepts two arguments
  setStatus: (status: RecommendStatus, message?: string) => void;
  setError: (message: string) => void;
  setResult: (result: RecommendResult) => void;
  reset: () => void;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  status: "idle" as RecommendStatus,
  statusMessage: null,
  prompt: "",
  errorMessage: null,
  result: null,
  vibeCheck: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useRecommendStore = create<RecommendState>((set) => ({
  ...initialState,

  setPrompt: (prompt) => set({ prompt }),

  // Processes main status and live stream text
  setStatus: (status, message) => 
    set({ 
      status, 
      statusMessage: message ?? null 
    }),

  setError: (message) =>
    set({
      status: "error",
      errorMessage: message,
      statusMessage: null,
    }),

  setResult: (result) =>
    set({
      status: "success",
      result,
      vibeCheck: result.vibeCheck ?? null,
      errorMessage: null,
      statusMessage: null,
    }),

  reset: () => set(initialState),
}));