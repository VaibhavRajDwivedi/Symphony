function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[ENV] Missing required environment variable: "${key}"\n` +
      `Make sure your server/.env file is complete.`
    );
  }
  return value;
}

export const env = {
  // Server
  PORT: parseInt(process.env.PORT ?? "5000", 10),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://127.0.0.1:3000",
  BACKEND_URL: process.env.BACKEND_URL || (process.env.NODE_ENV === "production" ? "" : `http://127.0.0.1:${process.env.PORT || "5000"}`),
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_here",

  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // AI Configuration
  AI_PROVIDER: (process.env.AI_PROVIDER || "gemini") as "gemini" | "groq",
  GROQ_API_KEY: process.env.AI_PROVIDER === "groq" ? requireEnv("GROQ_API_KEY") : process.env.GROQ_API_KEY,

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "missing_client_id",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "missing_client_secret",

  // Spotify
  SPOTIFY_CLIENT_ID: requireEnv("SPOTIFY_CLIENT_ID"),
  SPOTIFY_CLIENT_SECRET: requireEnv("SPOTIFY_CLIENT_SECRET"),
  SPOTIFY_REDIRECT_URI: requireEnv("SPOTIFY_REDIRECT_URI"),
  SPOTIFY_MASTER_USER_ID: requireEnv("SPOTIFY_MASTER_USER_ID"),

  // Gemini
  GEMINI_API_KEY: requireEnv("GEMINI_API_KEY"),

  // LastFM
  LASTFM_API_KEY: requireEnv("LASTFM_API_KEY"),
  LASTFM_SHARED_SECRET: requireEnv("LASTFM_SHARED_SECRET"),

  // Computed
  get API_URL() {
    return this.BACKEND_URL;
  },
} as const;



// Validation for AI_PROVIDER
if (!["gemini", "groq"].includes(env.AI_PROVIDER)) {
  throw new Error(`[ENV] Invalid AI_PROVIDER: "${env.AI_PROVIDER}". Must be "gemini" or "groq".`);
}