import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows Next.js to accept development WebSocket connections from your local IP
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;