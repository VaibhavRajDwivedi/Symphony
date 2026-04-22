// ─── App Status ───────────────────────────────────────────────────────────────

export type AppStatus =
  | "idle"
  | "uploading"
  | "extracting"
  | "searching"
  | "success"
  | "error";

// ─── Track ────────────────────────────────────────────────────────────────────

export interface Track {
  title: string;
  artist: string;
  spotifyUri: string;
  spotifyUrl: string;
  albumArt?: string | undefined;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface NotFoundTrack {
  title: string;
  artist: string;
}

export interface GeneratePlaylistResult {
  playlistUrl: string;
  playlistId: string;
  tracks: Track[];
  notFound: NotFoundTrack[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}


export interface GeneratePlaylistResult {
  playlistUrl: string;
  playlistId: string;
  tracks: Track[];
  notFound: NotFoundTrack[];
  vibeCheck?: string | null;
}