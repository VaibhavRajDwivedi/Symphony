"use client";

import { ExternalLink, Copy, CheckCheck, Plus } from "lucide-react";
import { useState, Suspense } from "react";
import { useAppStore } from "../store/useAppStore";
import SaveToSpotify from "./SaveToSpotify";

export default function ResultCard() {
  const { playlistUrl, tracks, status, reset } = useAppStore();
  const [copied, setCopied] = useState(false);

  if (status !== "success" || !playlistUrl) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(playlistUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div
      className="animate-fade-up"
      style={{
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto",
        borderRadius: "16px",
        border: "1px solid rgba(29, 185, 84, 0.3)",
        background: "rgba(29, 185, 84, 0.04)",
        padding: "24px",
      }}
    >
      {/* Success header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 8px var(--green)",
            flexShrink: 0,
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}
        >
          Playlist created
        </p>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "12px",
            color: "var(--green)",
          }}
        >
          {tracks.length} tracks
        </span>
      </div>

      {/* URL display */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "var(--font-body)",
            margin: 0,
          }}
        >
          {playlistUrl}
        </p>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        {/* Open in Spotify */}
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            minWidth: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "10px",
            background: "var(--green)",
            color: "#000",
            textDecoration: "none",
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 700,
            transition: "opacity 0.2s ease",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <ExternalLink size={14} />
          Open in Spotify
        </a>

        {/* Save to Spotify account */}
        <Suspense fallback={null}>
          <SaveToSpotify tracks={tracks} />
        </Suspense>

        {/* Copy URL */}
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: copied ? "rgba(29,185,84,0.1)" : "var(--bg-card)",
            color: copied ? "var(--green)" : "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>

        {/* New Playlist */}
        <button
          onClick={reset}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-primary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
          }}
        >
          <Plus size={14} />
          New Playlist
        </button>
      </div>

      {/* 24hr warning */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "8px",
          background: "rgba(255, 185, 0, 0.06)",
          border: "1px solid rgba(255, 185, 0, 0.2)",
        }}
      >
        <span style={{ fontSize: "13px", flexShrink: 0 }}>⚠️</span>
        <p
          style={{
            fontSize: "12px",
            color: "#c9a227",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          This playlist will be{" "}
          <strong>automatically deleted in 24 hours</strong>. Open it in
          Spotify and click <strong>Save</strong> to keep it forever — or use{" "}
          <strong>Save to My Spotify</strong> above to save it directly to your
          account.
        </p>
      </div>
    </div>
  );
}