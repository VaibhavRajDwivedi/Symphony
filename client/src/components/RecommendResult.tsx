"use client";

import { useState, Suspense } from "react";
import {
  ExternalLink,
  Copy,
  CheckCheck,
  RotateCcw,
  Music2,
  AlertCircle,
  Sparkles,
  ListMusic,
} from "lucide-react";
import { useRecommendStore } from "../store/useRecommendStore";
import SaveToSpotify from "./SaveToSpotify";

export default function RecommendResult() {
  const { status, result, prompt, reset } = useRecommendStore();
  const [copied, setCopied] = useState(false);

  // Renders strictly after successful pipeline execution.
  if (status !== "success" || !result) return null;

  const { playlistName, playlistUrl, tracks, notFound } = result;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(playlistUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy URL");
    }
  };

  return (
    <div
      className="animate-fade-up"
      style={{
        width: "100%",
        maxWidth: "640px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* ── Success header card ── */}
      <div
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(29,185,84,0.3)",
          background: "rgba(29,185,84,0.04)",
          padding: "24px",
        }}
      >
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          {/* Pulsing green dot */}
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 10px var(--green)",
              flexShrink: 0,
              marginTop: "6px",
              animation: "pulse-green 2s ease infinite",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(18px, 3.5vw, 22px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.25,
                marginBottom: "6px",
                wordBreak: "break-word",
              }}
            >
              {playlistName}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              <Sparkles size={11} color="var(--green)" />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--green)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                }}
              >
                {tracks.length} tracks curated by AI
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                ·
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "320px",
                }}
              >
                "{prompt}"
              </span>
            </div>
          </div>
        </div>

        {/* URL display */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            margin: "16px 0",
            overflow: "hidden",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              margin: 0,
              fontFamily: "var(--font-body)",
            }}
          >
            {playlistUrl}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {/* Open in Spotify */}
          <a
            id="recommend-open-spotify-btn"
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              minWidth: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              padding: "11px 16px",
              borderRadius: "10px",
              background: "var(--green)",
              color: "#000",
              textDecoration: "none",
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              fontWeight: 700,
              transition: "opacity 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ExternalLink size={13} />
            Open in Spotify
          </a>

          {/* Save to Spotify account (PKCE flow) */}
          <Suspense fallback={null}>
            <SaveToSpotify tracks={tracks} />
          </Suspense>

          {/* Copy URL */}
          <button
            id="recommend-copy-url-btn"
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "11px 16px",
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
            {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* New recommendation */}
          <button
            id="recommend-new-btn"
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "11px 16px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-heading)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }}
          >
            <RotateCcw size={13} />
            New
          </button>
        </div>

        {/* 24hr auto-delete notice */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(255,185,0,0.06)",
            border: "1px solid rgba(255,185,0,0.2)",
            marginTop: "16px",
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
            Spotify and click <strong>Save</strong> to keep it — or use{" "}
            <strong>Save to My Spotify</strong> above to add it directly to your
            account.
          </p>
        </div>
      </div>

      {/* ── Track list ── */}
      <div>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
            padding: "0 2px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <ListMusic size={13} color="var(--text-muted)" />
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Curated playlist
            </span>
          </div>
          <span
            style={{ fontSize: "12px", color: "var(--green)" }}
          >
            {tracks.length} tracks
          </span>
        </div>

        {/* Tracks */}
        <div
          style={{
            borderRadius: "16px",
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            overflow: "hidden",
          }}
        >
          {tracks.map((track, index) => (
            <a
              key={`${track.spotifyUri}-${index}`}
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                borderBottom:
                  index < tracks.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-card-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Track number */}
              <span
                style={{
                  width: "22px",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  flexShrink: 0,
                  textAlign: "right",
                  fontFamily: "var(--font-body)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Album art */}
              <div
                style={{
                  width: "38px",
                  height: "38px",
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
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Music2 size={15} color="var(--text-muted)" />
                )}
              </div>

              {/* Title + artist */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "1px",
                  }}
                >
                  {track.title}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {track.artist}
                </p>
              </div>

              {/* External link indicator */}
              <ExternalLink
                size={12}
                color="var(--text-muted)"
                style={{ flexShrink: 0, opacity: 0.5 }}
              />
            </a>
          ))}
        </div>

        {/* Not-found section */}
        {notFound.length > 0 && (
          <div
            className="animate-fade-in"
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
              size={15}
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
                {notFound.length} track{notFound.length > 1 ? "s" : ""} not
                found on Spotify
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {notFound.map((t) => `${t.title} — ${t.artist}`).join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
