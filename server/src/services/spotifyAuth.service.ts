import axios from "axios";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";
import type { SpotifyTokenResponse } from "../types";

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com";
const MASTER_TOKEN_ID = "master_account";

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

// ─── Build OAuth URL ──────────────────────────────────────────────────────────

export function getSpotifyAuthUrl(): string {
  const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-private",
    "user-read-email"
  ].join(" ");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    show_dialog: "true",
  });

  return `${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`;
}

// ─── Exchange code for tokens (once only) ─────────────────────────────────────

export async function exchangeCodeForTokens(code: string): Promise<void> {
  const basicAuth = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const { data } = await axios.post<SpotifyTokenResponse>(
    `${SPOTIFY_ACCOUNTS_URL}/api/token`,
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.SPOTIFY_REDIRECT_URI,
    }),
    {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!data.refresh_token) {
    throw new Error(
      "Spotify did not return a refresh_token. " +
        "Revoke app access from your Spotify account and try again."
    );
  }

  await prisma.spotifyToken.upsert({
    where: { id: MASTER_TOKEN_ID },
    update: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    },
    create: {
      id: MASTER_TOKEN_ID,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    },
  });

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  console.log("✅ Spotify master account authenticated and tokens saved.");
}

// ─── Get valid access token (auto-refreshes) ─────────────────────────────────

export async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const stored = await prisma.spotifyToken.findUnique({
    where: { id: MASTER_TOKEN_ID },
  });

  if (!stored) {
    throw new Error(
      "No Spotify master token found. " +
        "Visit http://127.0.0.1:5000/api/auth/login to authenticate."
    );
  }

  const basicAuth = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  let data: SpotifyTokenResponse;
  try {
    const res = await axios.post<SpotifyTokenResponse>(
      `${SPOTIFY_ACCOUNTS_URL}/api/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: stored.refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    data = res.data;
  } catch (err: any) {
    console.error("[Spotify Auth Error] Token refresh failed:", err.response?.data || err.message);
    throw new Error("Failed to refresh Spotify Master Token. Ensure the token is valid or re-authenticate.");
  }

  await prisma.spotifyToken.update({
    where: { id: MASTER_TOKEN_ID },
    data: {
      accessToken: data.access_token,
      ...(data.refresh_token && { refreshToken: data.refresh_token }),
    },
  });

  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  console.log("🔄 Spotify access token refreshed.");
  return cachedAccessToken;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export async function isMasterAccountSetup(): Promise<boolean> {
  const record = await prisma.spotifyToken.findUnique({
    where: { id: MASTER_TOKEN_ID },
  });
  return !!record;
}

export async function getUserSpotifyToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { spotifyAccessToken: true }
  });

  if (!user || !user.spotifyAccessToken) {
    throw new Error("User Spotify token not found. Please connect your Spotify account.");
  }

  return user.spotifyAccessToken;
}