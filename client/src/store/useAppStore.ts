import { create } from "zustand";
import type { AppStatus, Track, NotFoundTrack, GeneratePlaylistResult } from "../types";

interface AppState {
  // Status
  status: AppStatus;
  errorMessage: string | null;

  // Data
  previewImage: string | null;
  tracks: Track[];
  notFound: NotFoundTrack[];
  playlistUrl: string | null;
  playlistId: string | null;
  vibeCheck: string | null; // Stores vibe check value

  // Actions
  setStatus: (status: AppStatus) => void;
  setError: (message: string) => void;
  setPreviewImage: (url: string | null) => void;
  setResult: (result: GeneratePlaylistResult) => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as AppStatus,
  errorMessage: null,
  previewImage: null,
  tracks: [],
  notFound: [],
  playlistUrl: null,
  playlistId: null,
  vibeCheck: null, // Initial state for vibe check
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),

  setError: (message) =>
    set({
      status: "error",
      errorMessage: message,
    }),

  setPreviewImage: (url) => set({ previewImage: url }),

  setResult: (result) =>
    set({
      status: "success",
      tracks: result.tracks,
      notFound: result.notFound,
      playlistUrl: result.playlistUrl,
      playlistId: result.playlistId,
      vibeCheck: result.vibeCheck ?? null, // Incorporates vibe check into result
    }),

  reset: () => set(initialState),
}));