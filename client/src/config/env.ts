// 1. Evaluate at the absolute top-level so Webpack catches it instantly during build
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export const env = {
  // 2. Clean the trailing slash inline
  NEXT_PUBLIC_API_URL: RAW_API_URL.endsWith("/") ? RAW_API_URL.slice(0, -1) : RAW_API_URL,
  
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
  
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 
    (typeof window !== "undefined" ? `${window.location.origin}/callback` : "http://127.0.0.1:3000/callback"),
} as const;