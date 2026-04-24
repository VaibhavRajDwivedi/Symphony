import axios from "axios";
import { env } from "../config/env.js";
import { expandWithLastFm } from "./lastfm.service.js";
import { getAccessToken, getUserSpotifyToken } from "./spotifyAuth.service.js";
import { extractPlaylistId, getPlaylistTracks } from "./spotifyPlaylist.service.js";
import { getGeminiCompletion } from "./gemini.service.js";
import { getGroqCompletion, getGroqText } from "./groq.service.js";
import type { GeminiSong, ScoredCandidate } from "./lastfm.service.js";
import type { ResolvedTrack, SpotifySearchResponse, SpotifyPlaylistResponse } from "../types/index.js";
import { playlistAgent, remixAgent } from "./playlistGraph.js";

/**
 * Unified AI call router used by the rest of the pipeline.
 */
export async function callAI<T>(
  prompt: string,
  temperature: number = 0.7,
  systemPrompt?: string
): Promise<T> {
  if (env.AI_PROVIDER === "groq") {
    return getGroqCompletion(prompt, systemPrompt);
  } else {
    return getGeminiCompletion<T>(prompt, temperature);
  }
}

// ─── Stage 1: Intent ──────────────────────────────────────────────────────────

export interface ParsedIntent {
  mood: string;
  era: string;
  genre: string[];
  tempo: string;
  language: string;
  themes: string[];
  seedArtists: string[];
  excludeGenres: string[];
  playlistName: string;
  targetTrackCount?: number | null;
}

async function parseIntent(userPrompt: string): Promise<ParsedIntent> {
  console.log("[Stage 1] Parsing intent...");

  const systemPrompt = "You are a precise music intent parser. Pay close attention to the difference between time periods/decades (e.g., '90s') and requested quantities (e.g., '90 songs'). Return ONLY valid JSON.";
  const prompt =
    `User prompt: '${userPrompt}'. ` +
    `Return ONLY valid JSON, no markdown: ` +
    `{ mood, era, genre: [], tempo, language, themes: [], seedArtists: [], excludeGenres: [], playlistName, targetTrackCount: "number (integer representing how many songs the user explicitly asked for, or null if none specified)" }`;

  const intent = await callAI<ParsedIntent>(prompt, 0.2, systemPrompt);
  console.log(`[Stage 1] ✅ Parsed intent — playlistName: "${intent.playlistName}"`);
  return intent;
}

// ─── Stage 2: Song Generation ─────────────────────────────────────────────────

async function generateSeeds(
  userPrompt: string,
  intent: ParsedIntent
): Promise<GeminiSong[]> {
  console.log("[Stage 2] Generating 25 seed songs using LangGraph...");

  const prompt =
    `User prompt: "${userPrompt}". ` +
    `Mood: ${intent.mood}. Era: ${intent.era}. Genre: ${intent.genre.join(", ")}. ` +
    `Tempo: ${intent.tempo}. Language: ${intent.language}. Themes: ${intent.themes.join(", ")}. ` +
    `Seed artists: ${intent.seedArtists.join(", ") || "none"}. ` +
    `Exclude genres: ${intent.excludeGenres.join(", ") || "none"}. ` +
    `Rules: ` +
    `1. Return exactly 25 songs. ` +
    `2. Mix well-known and hidden gems (ratio 60:40). ` +
    `3. NO karaoke, covers, or tribute versions. ` +
    `4. Vary artists — max 2 songs per artist. ` +
    `5. Each song must genuinely match the mood. ` +
    `6. Include confidence score 0-1. ` +
    `Return ONLY valid JSON: { "songs": [{title, artist, reason, confidence}] }`;

  // Triggers LangGraph State Machine
  const finalState = await playlistAgent.invoke({
    prompt,
    draftTracks: [],
    feedback: "",
    attempts: 0
  });

  const validated = finalState.draftTracks;

  if (validated.length === 0) {
    throw new Error(`${env.AI_PROVIDER} via LangGraph did not return a valid song list for Stage 2.`);
  }

  console.log(`[Stage 2] ✅ Got ${validated.length} seeds from ${env.AI_PROVIDER} via LangGraph after ${finalState.attempts} attempts.`);
  return validated;
}


// ─── Stage 4: Curation ────────────────────────────────────────────────────────

interface CuratedTrack {
  title: string;
  artist: string;
}

async function curatePlaylist(
  userPrompt: string,
  intent: ParsedIntent,
  candidates: ScoredCandidate[]
): Promise<CuratedTrack[]> {
  const targetCount = intent.targetTrackCount || 20;
  console.log(`[Stage 4] Curating ${candidates.length} candidates → ${targetCount} tracks...`);

  const candidateList = candidates
    .map((c, i) => `${i + 1}. "${c.title}" by ${c.artist} (score: ${c.score.toFixed(3)})`)
    .join("\n");

  const systemPrompt = "You are a playlist curator. Order songs for best flow and return only valid JSON. If using Groq, return an object with a 'curated' key containing the array.";
  const prompt =
    `You are a playlist curator. From the candidates below, select the best ${targetCount} songs. ` +
    `Original request: '${userPrompt}'. ` +
    `Intent: ${JSON.stringify(intent)}. ` +
    `Candidates:\n${candidateList}\n` +
    `Rules: ` +
    `1. Select exactly ${targetCount} tracks. ` +
    `2. No two consecutive tracks by the same artist. ` +
    `3. Order them for best listening flow. ` +
    `4. Start strong, build to peak around track 10-12, cool down toward end. ` +
    `5. Prioritize variety over repetition. ` +
    `Return ONLY valid JSON: { "curated": [{title, artist}] }`;

  const response = await callAI<any>(prompt, 0.5, systemPrompt);
  const curated = Array.isArray(response) ? response : (response.curated || response.tracks || response.songs || []);

  if (!Array.isArray(curated) || curated.length === 0) {
    throw new Error(`${env.AI_PROVIDER} did not return a valid curated list for Stage 4.`);
  }

  const trimmed = curated.slice(0, targetCount);
  console.log(`[Stage 4] ✅ Curated ${trimmed.length} tracks.`);
  return trimmed;
}


// ─── Stage 5: Spotify Search (7-pass waterfall) ───────────────────────────────

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

function sanitize(text: string): string {
  if (!text) return "";
  return text
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .split(/feat\.?|ft\.?|featuring/i)[0]!
    .trim();
}

async function searchTrack(
  title: string,
  artist: string,
  accessToken: string
): Promise<ResolvedTrack | null> {
  const cleanTitle = sanitize(title);
  const cleanArtist = sanitize(artist.split(",")[0] || artist);

  const search = async (query: string, limit = 5) => {
    const { data } = await axios.get<SpotifySearchResponse>(
      `${SPOTIFY_API_URL}/search`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { q: query, type: "track", limit },
      }
    );
    return data.tracks?.items ?? [];
  };

  try {
    let items = await search(`track:"${cleanTitle}" artist:"${cleanArtist}"`);
    if (items.length === 0) items = await search(`${cleanTitle} ${cleanArtist}`);
    if (items.length === 0) items = await search(`${title} ${artist}`);
    if (items.length === 0) items = await search(`${title} ${artist.split(",")[0]!.trim()}`);
    if (items.length === 0) items = await search(cleanTitle, 10);
    if (items.length === 0) {
      const baseTitle = title.split(/ [-—] /)[0]!.trim();
      items = await search(`${baseTitle} ${cleanArtist}`, 10);
    }
    if (items.length === 0) {
      const baseTitle = title.split(/ [-—] /)[0]!.trim();
      items = await search(baseTitle, 15);
    }

    if (items.length === 0) return null;

    const best =
      items.find((item) =>
        item.artists.some(
          (a) =>
            a.name.toLowerCase().includes(cleanArtist.toLowerCase()) ||
            cleanArtist.toLowerCase().includes(a.name.toLowerCase())
        )
      ) ?? items[0]!;

    return {
      title: best.name,
      artist: best.artists.map((a) => a.name).join(", "),
      spotifyUri: best.uri,
      spotifyUrl: best.external_urls.spotify,
      albumArt: best.album?.images?.[0]?.url,
    };
  } catch (err: any) {
    console.error(`[Spotify] Search error for "${title}":`, err.message);
    return null;
  }
}

// ─── Stage 6: Playlist Creation ───────────────────────────────────────────────

async function createSpotifyPlaylist(
  accessToken: string,
  name: string
): Promise<string> {
  const { data } = await axios.post<SpotifyPlaylistResponse>(
    `${SPOTIFY_API_URL}/me/playlists`,
    {
      name,
      description: "Curated by Symphony AI 🎵 — your vibe, perfected.",
      public: true,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(`[Stage 6] Playlist created — ID: ${data.id}`);
  return data.id;
}

async function addTracksToPlaylist(
  playlistId: string,
  uris: string[],
  accessToken: string
): Promise<void> {
  for (let i = 0; i < uris.length; i += 100) {
    await axios.post(
      `${SPOTIFY_API_URL}/playlists/${playlistId}/items`,
      { uris: uris.slice(i, i + 100) },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// ─── Public Response Type ─────────────────────────────────────────────────────

export interface RecommendResult {
  playlistUrl: string;
  playlistId: string;
  playlistName: string;
  tracks: ResolvedTrack[];
  notFound: Array<{ title: string; artist: string }>;
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

export async function runRecommendPipeline(
  userPrompt: string,
  sourceUrl?: string,
  userId?: string | null
): Promise<RecommendResult> {
  if (sourceUrl) {
    if (!userId) throw new Error("User ID is required for Remix mode.");
    return runRemixPipeline(userPrompt, sourceUrl, userId);
  }

  console.log(`\n[Pipeline] ▶ Starting for prompt: "${userPrompt}" using ${env.AI_PROVIDER}\n`);

  // ── Stage 1 ──
  const intent = await parseIntent(userPrompt);

  // ── Stage 2 ──
  const seeds = await generateSeeds(userPrompt, intent);

  // ── Stage 3 ──
  console.log("[Stage 3] Expanding via Last.fm...");
  const candidates = await expandWithLastFm(seeds);

  // ── Stage 4 ──
  const curated = await curatePlaylist(userPrompt, intent, candidates);

  // ── Stage 5 ──
  console.log(`[Stage 5] Searching Spotify for ${curated.length} tracks...`);
  const accessToken = await getAccessToken();

  // Implements sequential loop for API requests to mitigate rate limiting
  const searchResults: (ResolvedTrack | null)[] = [];
  
  for (const t of curated) {
    const result = await searchTrack(t.title, t.artist, accessToken);
    searchResults.push(result);
    
    // Introduces 200ms delay to prevent Spotify 429 rate limit errors
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const resolved: ResolvedTrack[] = [];
  const notFound: Array<{ title: string; artist: string }> = [];

  searchResults.forEach((result, i) => {
    if (result) {
      resolved.push(result);
    } else {
      notFound.push({ title: curated[i]!.title, artist: curated[i]!.artist });
    }
  });

  if (resolved.length === 0) {
    throw new Error("None of the curated tracks could be found on Spotify.");
  }

  // ── Stage 6 ──
  // Provides fallback name to ensure valid Spotify payload
  const finalPlaylistName = intent.playlistName || "Symphony Generated Mix"; 
  
  const playlistId = await createSpotifyPlaylist(accessToken, finalPlaylistName);
  const uris = resolved.map((t) => t.spotifyUri);
  await addTracksToPlaylist(playlistId, uris, accessToken);

  return {
    playlistUrl: `https://open.spotify.com/playlist/${playlistId}`, // Applies corrected URL format
    playlistId,
    playlistName: finalPlaylistName,
    tracks: resolved,
    notFound,
  };
}

// ─── Remix Pipeline (Step 3 & 4) ──────────────────────────────────────────────

export async function runRemixPipeline(
  userPrompt: string,
  sourceUrl: string,
  userId: string
): Promise<RecommendResult> {
  console.log(`\n[Pipeline] ▶ Starting Remix for prompt: "${userPrompt}" using ${env.AI_PROVIDER}\n`);

  const originalPlaylistId = extractPlaylistId(sourceUrl);
  if (!originalPlaylistId) {
    throw new Error("Invalid Spotify URL. Could not extract playlist ID.");
  }

  // Fetch specific user's token to read their playlist without 403 errors
  const userToken = await getUserSpotifyToken(userId);
  console.log(`[Remix] Fetching tracks for playlist ID: ${originalPlaylistId}...`);
  const tracks = await getPlaylistTracks(originalPlaylistId, userToken);
  console.log(`[Remix] Fetched ${tracks.length} tracks.`);

  if (tracks.length > 300 && env.AI_PROVIDER === "groq") {
    throw new Error("This playlist is too large for Groq. Please toggle to Gemini 2.5 Flash to analyze playlists with over 300 songs.");
  }

  console.log("[Remix] Triggering Remix LangGraph Agent...");
  const finalState = await remixAgent.invoke({
    prompt: userPrompt,
    tracks: tracks,
    draftIds: [],
    feedback: "",
    attempts: 0
  });

  let validIds = finalState.draftIds;
  if (!validIds || validIds.length === 0) {
    throw new Error(`${env.AI_PROVIDER} via LangGraph did not return a valid subset of tracks for the remix.`);
  }

  validIds = validIds.slice(0, 100);
  const uris = validIds.map((id: string) => `spotify:track:${id}`);

  const resolvedTracks: ResolvedTrack[] = tracks
    .filter((t: any) => validIds.includes(t.id))
    .map((t: any) => ({
      title: t.title,
      artist: t.artist,
      spotifyUri: `spotify:track:${t.id}`,
      spotifyUrl: `https://open.spotify.com/track/${t.id}`,
      albumArt: undefined,
    }));

  const trackList = resolvedTracks
    .slice(0, 8)
    .map((t) => `${t.title} by ${t.artist}`)
    .join(", ");
  const playlistName = await getGroqText(
    `These songs are in a remixed playlist: ${trackList}\n\nGive this playlist a short, creative, vibe-based name (2-4 words). No quotes, no explanation, just the name.`
  ) || `Remixed Mix — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  
  // Re-fetches MASTER token to write the new playlist (user token was only needed for the read).
  const masterToken = await getAccessToken();
  const newPlaylistId = await createSpotifyPlaylist(masterToken, playlistName);

  console.log(`[Remix] Adding ${uris.length} tracks to new playlist...`);
  await addTracksToPlaylist(newPlaylistId, uris, masterToken);

  return {
    playlistUrl: `https://open.spotify.com/playlist/${newPlaylistId}`,
    playlistId: newPlaylistId,
    playlistName,
    tracks: resolvedTracks,
    notFound: [],
  };
}