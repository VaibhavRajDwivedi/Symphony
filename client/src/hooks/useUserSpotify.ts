"use client";

import { useState, useEffect, useCallback } from "react";
import { buildSpotifyAuthUrl, exchangeCodeForToken } from "../lib/spotifyPKCE";
import type { Track } from "../types";

type SaveStatus = "idle" | "authenticating" | "saving" | "success" | "error";

interface UseUserSpotifyReturn {
  saveStatus: SaveStatus;
  savedPlaylistUrl: string | null;
  errorMessage: string | null;
  initiateAuth: (tracks: Track[]) => Promise<void>;
  handleCallback: (code: string, state: string) => Promise<void>;
}

const VERIFIER_KEY = "symphony_pkce_verifier";
const STATE_KEY = "symphony_pkce_state";
const PENDING_TRACKS_KEY = "symphony_pending_tracks";
const SPOTIFY_API = "https://api.spotify.com/v1";

export function useUserSpotify(): UseUserSpotifyReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedPlaylistUrl, setSavedPlaylistUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);

  // ─── Save playlist directly via Spotify API ───────────────────────────────

  const savePlaylist = useCallback(async (token: string, tracks: Track[]) => {
    setSaveStatus("saving");
    try {
      const name = `Symphony Mix — ${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;

      // Create playlist
      const createRes = await fetch(`${SPOTIFY_API}/me/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: "Created by Symphony 🎵 — AI-powered playlist creator",
          public: true,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error?.message ?? "Failed to create playlist.");
      }

      const playlist = await createRes.json();
      const playlistId: string = playlist.id;

      // Add tracks in chunks of 100
      const uris = tracks.map((t) => t.spotifyUri).filter(Boolean);
      for (let i = 0; i < uris.length; i += 100) {
        const chunk = uris.slice(i, i + 100);
        const addRes = await fetch(
          `${SPOTIFY_API}/playlists/${playlistId}/items`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: chunk }),
          }
        );
        if (!addRes.ok) {
          const err = await addRes.json();
          throw new Error(err.error?.message ?? "Failed to add tracks.");
        }
      }

      setSavedPlaylistUrl(`https://open.spotify.com/playlist/${playlistId}`);
      setSaveStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save playlist.";
      setErrorMessage(msg);
      setSaveStatus("error");
    } finally {
      sessionStorage.removeItem(VERIFIER_KEY);
      sessionStorage.removeItem(STATE_KEY);
      sessionStorage.removeItem(PENDING_TRACKS_KEY);
    }
  }, []);

  // ─── Handle popup message ─────────────────────────────────────────────────

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "SPOTIFY_CALLBACK") return;
      if (popupWindow && !popupWindow.closed) popupWindow.close();
      const { code, state } = event.data;
      await handleCallback(code, state);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [popupWindow]);

  // ─── Initiate auth ────────────────────────────────────────────────────────

  const initiateAuth = useCallback(async (tracks: Track[]) => {
    setSaveStatus("authenticating");
    setErrorMessage(null);
    try {
      const { url, codeVerifier, state } = await buildSpotifyAuthUrl();
      sessionStorage.setItem(VERIFIER_KEY, codeVerifier);
      sessionStorage.setItem(STATE_KEY, state);
      sessionStorage.setItem(PENDING_TRACKS_KEY, JSON.stringify(tracks));

      const popup = window.open(
        url,
        "spotify-auth",
        "width=500,height=700,scrollbars=yes,resizable=yes"
      );

      if (popup && !popup.closed) {
        setPopupWindow(popup);
        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            setSaveStatus((current) => {
              if (current === "authenticating") {
                setErrorMessage("Authorization cancelled.");
                return "error";
              }
              return current;
            });
          }
        }, 500);
      } else {
        // Popup blocked — redirect fallback
        window.location.href = url;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initiate auth.";
      setErrorMessage(msg);
      setSaveStatus("error");
    }
  }, []);

  // ─── Handle callback ──────────────────────────────────────────────────────

  const handleCallback = useCallback(
    async (code: string, state: string) => {
      try {
        const storedVerifier = sessionStorage.getItem(VERIFIER_KEY);
        const storedState = sessionStorage.getItem(STATE_KEY);
        const storedTracks = sessionStorage.getItem(PENDING_TRACKS_KEY);

        if (!storedVerifier || !storedState || !storedTracks) {
          throw new Error("Auth session expired. Please try again.");
        }
        if (state !== storedState) {
          throw new Error("State mismatch. Please try again.");
        }

        const token = await exchangeCodeForToken(code, storedVerifier);
        const tracks: Track[] = JSON.parse(storedTracks);
        await savePlaylist(token, tracks);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Authentication failed.";
        setErrorMessage(msg);
        setSaveStatus("error");
        sessionStorage.removeItem(VERIFIER_KEY);
        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(PENDING_TRACKS_KEY);
      }
    },
    [savePlaylist]
  );

  return { saveStatus, savedPlaylistUrl, errorMessage, initiateAuth, handleCallback };
}