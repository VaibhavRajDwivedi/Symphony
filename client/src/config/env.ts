const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
  // Remove trailing slash if present
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const env = {
  NEXT_PUBLIC_API_URL: getApiUrl(),
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/callback",
} as const;
