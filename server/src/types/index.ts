// ─── Track ────────────────────────────────────────────────────────────────────

export interface Track {
  title: string;
  artist: string;
}

export interface ResolvedTrack extends Track {
  spotifyUri: string;
  spotifyUrl: string;
  albumArt?: string | undefined;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GeneratePlaylistResponse {
  playlistUrl: string;
  playlistId: string;
  playlistName: string;
  tracks: ResolvedTrack[];
  notFound: Track[];
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface GeneratePlaylistBody {
  imageBase64: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
}

// ─── Spotify API shapes ───────────────────────────────────────────────────────

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyTrackItem {
  uri: string;
  external_urls: { spotify: string };
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string; width: number; height: number }>;
  };
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrackItem[];
  };
}

export interface SpotifyPlaylistResponse {
  id: string;
  external_urls: { spotify: string };
}