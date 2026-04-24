"use client";

import { ExternalLink, MessageSquare, Image as ImageIcon, Clock } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import PlaylistActions from "./PlaylistActions";
import MoodScoreCard from "./MoodScoreCard";

function extractSpotifyPlaylistId(url: string): string | null {
  // Example format: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoricalChatView() {
  const { chats, activeChatId } = useChatStore();
  const chat = chats.find((c) => c.id === activeChatId);

  if (!chat) return null;

  const playlistId = chat.playlistUrl
    ? extractSpotifyPlaylistId(chat.playlistUrl)
    : null;

  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        padding: "0 0 40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Displays mode badge and time */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid var(--border-hover)",
              background: "rgba(255,255,255,0.03)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            {chat.mode === "image" ? (
              <>
                <ImageIcon size={11} />
                Screenshot to Playlist
              </>
            ) : (
              <>
                <MessageSquare size={11} />
                Prompt to Playlist
              </>
            )}
          </div>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body)",
              marginLeft: "auto",
            }}
          >
            <Clock size={11} />
            {formatDate(chat.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          {chat.title || "Chat Session"}
        </h2>

        {/* Displays prompt text */}
        {chat.promptText && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {chat.promptText}
            </p>
          </div>
        )}

        {/* Open link */}
        {chat.playlistUrl && (
          <a
            href={chat.playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "10px",
              background: "var(--green)",
              color: "#000",
              textDecoration: "none",
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              fontWeight: 700,
              width: "fit-content",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ExternalLink size={14} />
            Open in Spotify
          </a>
        )}
      </div>

      {/* Embedded Spotify Player */}
      {playlistId && (
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
          }}
        >
          <iframe
            title="Spotify Playlist"
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ display: "block", border: "none" }}
          />
        </div>
      )}

      {/* Track Details & Mood Score (Fix 5) */}
      {chat.playlistUrl && chat.tracks && chat.tracks.length > 0 && (
        <>
          <PlaylistActions playlistUrl={chat.playlistUrl} tracks={chat.tracks} />
          <MoodScoreCard tracks={chat.tracks} />
        </>
      )}

      {/* Fallback for missing playlist */}
      {!chat.playlistUrl && (
        <div
          style={{
            padding: "32px",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            No playlist URL was saved for this session.
          </p>
        </div>
      )}
    </div>
  );
}
