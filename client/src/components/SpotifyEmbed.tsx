"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function SpotifyEmbed({
  playlistUrl,
  playlistId,
}: {
  playlistUrl: string;
  playlistId: string;
}) {
  const [isFirefox, setIsFirefox] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const timer = setTimeout(() => setReady(true), 3000); // 3s grace period
    return () => clearTimeout(timer);
  }, [playlistId]);

  useEffect(() => {
    setIsFirefox(navigator.userAgent.toLowerCase().includes("firefox"));
  }, []);

  if (!playlistId) return null;

  if (!ready) return (
    <div style={{ height: "352px", borderRadius: "14px", background: "#121212", 
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#a0a0a0", fontSize: "13px" }}>Loading playlist...</p>
    </div>
  );

  if (isFirefox) {
    return (
      <div
        style={{
          width: "100%",
          padding: "24px",
          borderRadius: "14px",
          border: "1px solid #1a1a1a",
          background: "#111111",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <p style={{ fontSize: "13px", color: "#a0a0a0", lineHeight: 1.6, margin: 0 }}>
          🦊 Spotify's embedded player is blocked by Firefox's cookie restrictions.
          Open the playlist directly in Spotify instead.
        </p>
        
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            borderRadius: "8px",
            background: "#1db954",
            color: "#000",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "14px",
            fontFamily: "Syne, sans-serif",
          }}
        >
          <ExternalLink size={15} />
          Open in Spotify
        </a>
      </div>
    );
  }

  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
      width="100%"
      height="352"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; storage-access"
      loading="lazy"
      style={{
        border: 0,
        borderRadius: "14px",
        background: "#121212",
      }}
    />
  );
}