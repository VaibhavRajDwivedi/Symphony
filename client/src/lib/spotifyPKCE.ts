import { env } from "../config/env";

// ─── PKCE Utilities ───────────────────────────────────────────────────────────

function generateRandomString(length: number): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((x) => charset[x % charset.length]!)
    .join("");
}

export function generateCodeVerifier(): string {
  return generateRandomString(128);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateState(): string {
  return generateRandomString(32);
}

// ─── Build Spotify Auth URL ───────────────────────────────────────────────────

export async function buildSpotifyAuthUrl(): Promise<{
  url: string;
  codeVerifier: string;
  state: string;
}> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    scope: "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-read-private",
    redirect_uri: env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
    show_dialog: "true",
  });

  return {
    url: `https://accounts.spotify.com/authorize?${params.toString()}`,
    codeVerifier,
    state,
  };
}

// ─── Exchange code for access token ──────────────────────────────────────────

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<string> {
  const redirectUri = env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const clientId = env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error_description ?? "Failed to exchange code for token.");
  }

  const data = await response.json();
  return data.access_token as string;
}