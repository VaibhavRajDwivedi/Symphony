import axios from "axios";
import { env } from "../config/env";

// ─── Types ────────────────────────────────────────────────────────────────────

/** A song recommendation produced by Gemini in Stage 2. */
export interface GeminiSong {
  title: string;
  artist: string;
  reason: string;
  confidence: number; // 0–1
}

/** A fully-scored candidate ready for Stage 4 curation. */
export interface ScoredCandidate {
  title: string;
  artist: string;
  /** Combined score: (similarityMatch * 0.6) + (geminiConfidence * 0.4) */
  score: number;
  /** The Gemini seed that produced this candidate (traceability). */
  sourceArtist: string;
}

// ─── Last.fm API shape (necessary fields only) ───────────────────────────────────

interface LastFmSimilarTrack {
  name: string;
  artist: { name: string };
  match: string; // Last.fm returns similarity as a decimal string, e.g. "0.847"
}

interface LastFmSimilarResponse {
  similartracks?: {
    track: LastFmSimilarTrack[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/";
const SIMILAR_LIMIT = 5;
const TOP_CANDIDATES = 80;

/**
 * Builds a deduplication key. Lower-cased and trimmed so
 * "Bohemian Rhapsody - Queen" and "bohemian rhapsody - queen" collapse.
 */
function dedupeKey(artist: string, title: string): string {
  return `${artist.trim().toLowerCase()}|||${title.trim().toLowerCase()}`;
}

/**
 * Fetches up to `SIMILAR_LIMIT` similar tracks for a single seed from Last.fm.
 * Returns an empty array on any network or API error — we don't want a single
 * failed seed to blow up the whole pipeline.
 */
async function fetchSimilarTracks(
  seed: GeminiSong
): Promise<Array<{ title: string; artist: string; similarity: number }>> {
  try {
    const { data } = await axios.get<LastFmSimilarResponse>(LASTFM_BASE, {
      params: {
        method: "track.getSimilar",
        artist: seed.artist,
        track: seed.title,
        limit: SIMILAR_LIMIT,
        autocorrect: 1,
        api_key: env.LASTFM_API_KEY,
        format: "json",
      },
      // Bail quickly so one slow track doesn't stall the pipeline.
      timeout: 8_000,
    });

    const tracks = data.similartracks?.track ?? [];

    return tracks.map((t) => ({
      title: t.name,
      artist: t.artist.name,
      // Last.fm returns similarity as a string; clamp to [0,1] just in case.
      similarity: Math.min(1, Math.max(0, parseFloat(t.match) || 0)),
    }));
  } catch (err: any) {
    // Non-fatal: log and move on. Common cause: obscure track not in Last.fm DB.
    console.warn(
      `[Last.fm] Could not fetch similar tracks for "${seed.title}" by ${seed.artist}:`,
      err.response?.data?.message ?? err.message
    );
    return [];
  }
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Stage 3 — Last.fm Expansion.
 *
 * For each of the 25 Gemini seeds:
 *   1. Fetches 5 similar tracks from Last.fm.
 *   2. Scores each similar track: (similarity * 0.6) + (geminiConfidence * 0.4).
 *   3. Also folds the seeds themselves in (scored at 1.0 similarity so they
 *      aren't unfairly penalised vs. their own expansions).
 *   4. Deduplicates by "artist|||title" key.
 *   5. Returns the top `TOP_CANDIDATES` (80) by score.
 */
export async function expandWithLastFm(
  seeds: GeminiSong[]
): Promise<ScoredCandidate[]> {
  // Fetch all similar-track batches in parallel — no reason to serialise here.
  const expansionBatches = await Promise.all(
    seeds.map(async (seed) => {
      const similar = await fetchSimilarTracks(seed);
      return { seed, similar };
    })
  );

  const seen = new Map<string, ScoredCandidate>();

  for (const { seed, similar } of expansionBatches) {
    // Fold the seed itself in with similarity = 1 so it can compete fairly.
    const seedKey = dedupeKey(seed.artist, seed.title);
    if (!seen.has(seedKey)) {
      const score = 1.0 * 0.6 + seed.confidence * 0.4;
      seen.set(seedKey, {
        title: seed.title,
        artist: seed.artist,
        score,
        sourceArtist: seed.artist,
      });
    }

    // Score and add each similar track.
    for (const track of similar) {
      const key = dedupeKey(track.artist, track.title);
      const score = track.similarity * 0.6 + seed.confidence * 0.4;

      // Keep the higher score if we've already seen this track from another seed.
      const existing = seen.get(key);
      if (!existing || score > existing.score) {
        seen.set(key, {
          title: track.title,
          artist: track.artist,
          score,
          sourceArtist: seed.artist,
        });
      }
    }
  }

  // Sort descending by score and take the top 80.
  const candidates = Array.from(seen.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_CANDIDATES);

  console.log(
    `[Last.fm] Expanded ${seeds.length} seeds → ${seen.size} unique candidates → keeping top ${candidates.length}.`
  );

  return candidates;
}
