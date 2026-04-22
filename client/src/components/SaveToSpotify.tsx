"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { useUserSpotify } from "../hooks/useUserSpotify";
import type { Track } from "../types";

interface SaveToSpotifyProps {
  tracks: Track[];
}

export default function SaveToSpotify({ tracks }: SaveToSpotifyProps) {
  const {
    saveStatus,
    savedPlaylistUrl,
    errorMessage,
    initiateAuth,
    handleCallback,
  } = useUserSpotify();

  const searchParams = useSearchParams();

  // Handle redirect fallback — when popup was blocked and user was redirected
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const authError = searchParams.get("auth_error");

    if (authError) {
      console.error("[SaveToSpotify] Auth error from redirect:", authError);
      return;
    }

    if (code && state) {
      handleCallback(code, state);
      // Clean URL without reload
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // ─── Render states ────────────────────────────────────────────────────────

  if (saveStatus === "success" && savedPlaylistUrl) {
    return (
      <a
        href={savedPlaylistUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid rgba(29,185,84,0.4)",
          background: "rgba(29,185,84,0.08)",
          color: "var(--green)",
          textDecoration: "none",
          fontFamily: "var(--font-heading)",
          fontSize: "13px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          transition: "all 0.2s ease",
        }}
      >
        <CheckCircle2 size={15} />
        Saved! Open playlist
      </a>
    );
  }

  if (saveStatus === "authenticating" || saveStatus === "saving") {
    return (
      <button
        disabled
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-heading)",
          fontSize: "13px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          cursor: "not-allowed",
          opacity: 0.7,
        }}
      >
        <Loader2
          size={14}
          style={{ animation: "spin 1s linear infinite" }}
        />
        {saveStatus === "authenticating"
          ? "Connecting..."
          : "Saving playlist..."}
      </button>
    );
  }

  if (saveStatus === "error") {
    return (
      <button
        onClick={() => initiateAuth(tracks)}
        title={errorMessage ?? "Try again"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1px solid rgba(255,100,100,0.3)",
          background: "rgba(255,100,100,0.06)",
          color: "#ff6464",
          fontFamily: "var(--font-heading)",
          fontSize: "13px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    );
  }

  // Default idle state
  return (
    <button
      onClick={() => initiateAuth(tracks)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-heading)",
        fontSize: "13px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--green)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--green)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(29,185,84,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "var(--text-secondary)";
        (e.currentTarget as HTMLButtonElement).style.background =
          "var(--bg-card)";
      }}
    >
      <ExternalLink size={14} />
      Save to My Spotify
    </button>
  );
}