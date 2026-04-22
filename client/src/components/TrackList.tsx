"use client";

import { Music2, AlertCircle } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default function TrackList() {
  const { tracks, notFound, status } = useAppStore();

  if (status !== "success" || tracks.length === 0) return null;

  return (
    <div
      className="animate-fade-up"
      style={{ width: "100%", maxWidth: "560px", margin: "0 auto" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          padding: "0 2px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Tracks found
        </p>
        <span
          style={{
            fontSize: "12px",
            color: "var(--green)",
            fontFamily: "var(--font-body)",
          }}
        >
          {tracks.length} tracks
        </span>
      </div>

      {/* Track list */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          overflow: "hidden",
        }}
      >
        {tracks.map((track, index) => {
          return (
            <a
              key={track.spotifyUri}
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 16px",
                borderBottom:
                  index < tracks.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                textDecoration: "none",
                transition: "background 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Album art */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Music2 size={16} color="var(--text-muted)" />
                )}
              </div>

              {/* Track info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "2px",
                  }}
                >
                  {track.title}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {track.artist}
                </p>
              </div>

              {/* Index */}
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  flexShrink: 0,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </a>
          );
        })}
      </div>

      {/* Not found */}
      {notFound.length > 0 && (
        <div
          style={{
            marginTop: "12px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid rgba(255,100,100,0.15)",
            background: "rgba(255,100,100,0.04)",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <AlertCircle
            size={16}
            color="#ff6464"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#ff6464",
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              {notFound.length} track{notFound.length > 1 ? "s" : ""} not found
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {notFound.map((t) => `${t.title} — ${t.artist}`).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}