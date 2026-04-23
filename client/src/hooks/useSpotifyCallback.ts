import { useEffect } from "react";
import { exchangeCodeForToken } from "../lib/spotifyPKCE";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { env } from "../config/env";

const API_BASE = `${env.NEXT_PUBLIC_API_URL}/api/auth/google`;

/**
 * Runs once auth is initialized. If Spotify redirected back to this page with
 * a `?code=` query parameter, this hook exchanges it for an access token,
 * persists it to the user's profile via the backend, and updates the auth
 * store so the Remix UI unlocks immediately.
 *
 * Depends on `isInitialized` so it never fires before `fetchMe` has resolved —
 * this ensures the JWT cookie is confirmed valid before we attempt `/spotify/save`.
 */
export function useSpotifyCallback() {
  const { setSpotifyConnected, isInitialized, user } = useAuthStore();

  useEffect(() => {
    // Don't run until fetchMe has completed — we need the JWT cookie to be
    // confirmed present before hitting /spotify/save.
    if (!isInitialized) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // No Spotify code in URL — nothing to do.
    if (!code) return;

    const run = async () => {
      const verifier = localStorage.getItem("spotify_verifier");

      if (!verifier) {
        console.error("[Spotify Callback] No code_verifier found in localStorage. Cannot exchange token.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (!user) {
        // User completed Spotify OAuth but is not logged in with Google.
        // We can't associate the token with an account — abort and clean up.
        console.error("[Spotify Callback] No authenticated Google session found. Please log in first.");
        localStorage.removeItem("spotify_verifier");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      try {
        const token = await exchangeCodeForToken(code, verifier);

        // Persist the token to the user's DB profile
        await axios.post(
          `${API_BASE}/spotify/save`,
          { accessToken: token },
          { withCredentials: true }
        );

        // Update the in-memory store so ChatInput unlocks instantly
        setSpotifyConnected(token);
      } catch (err) {
        console.error("[Spotify Callback] Failed to exchange Spotify code:", err);
      } finally {
        // Always clean up — prevents re-triggering on refresh
        localStorage.removeItem("spotify_verifier");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    run();
  // Re-run only when isInitialized flips to true; setSpotifyConnected is stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);
}
