"use client";

import { useAppStore } from "../../store/useAppStore";
import { useChatStore } from "../../store/useChatStore";
import { useRecommendStore } from "../../store/useRecommendStore";
import Navbar from "../../components/NavBar";
import ChatInput from "../../components/ChatInput";
import HistoricalChatView from "../../components/HistoricalChatView";
import LiveStatus from "../../components/LiveStatus";
import VibeCheck from "../../components/VibeCheck";
import SpotifyEmbed from "../../components/SpotifyEmbed";
import MoodScoreCard from "../../components/MoodScoreCard";
import PlaylistActions from "../../components/PlaylistActions";
import { useSpotifyCallback } from "../../hooks/useSpotifyCallback";
import { useBrowserWarning } from "../../hooks/useBrowserWarning";

export default function Home() {
  useSpotifyCallback();
  useBrowserWarning();

  const appState = useAppStore();
  const recState = useRecommendStore();
  const { activeChatId } = useChatStore();

  const isImageMode = appState.status !== "idle";
  const isTextMode = recState.status !== "idle";
  const isGenerating = isImageMode || isTextMode;

  const status = isImageMode ? appState.status : recState.status;
  const statusMessage = isTextMode
    ? recState.statusMessage
    : appState.status === "extracting"
    ? "Gemini is analyzing your screenshot..."
    : "Searching Spotify...";
  const playlistUrl = isImageMode ? appState.playlistUrl : recState.result?.playlistUrl;
  const playlistId = isImageMode ? appState.playlistId : recState.result?.playlistId;
  const tracks = isImageMode ? appState.tracks : recState.result?.tracks || [];
  const vibeCheck = isImageMode ? appState.vibeCheck : recState.vibeCheck;
  const errorMessage = isImageMode ? appState.errorMessage : recState.errorMessage;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      <Navbar />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "80px 24px 120px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {/* Historical Chat View */}
          {activeChatId && <HistoricalChatView />}

          {/* Idle Hero Screen */}
          {!activeChatId && !isGenerating && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(29,185,84,0.3)",
                  background: "rgba(29,185,84,0.05)",
                  marginBottom: "32px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#1db954",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  LangGraph · Gemini · Groq · Spotify API
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(42px, 7vw, 72px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.95,
                  color: "var(--text-primary)",
                  marginBottom: "24px",
                }}
              >
                Any input. Perfect playlists.
                <br />
                <span style={{ color: "#1db954" }}>Generated in seconds.</span>
              </h1>
              <p
                style={{
                  fontSize: "clamp(16px, 1.8vw, 18px)",
                  color: "var(--text-secondary)",
                  maxWidth: "500px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                  opacity: 0.8,
                }}
              >
                Upload a screenshot, describe your vibe, or remix an existing Spotify
                playlist. A 6-stage multi-agent pipeline does the rest.
              </p>
            </div>
          )}

          {/* Active Generation State */}
          {!activeChatId && isGenerating && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {status !== "success" && status !== "error" && (
                <LiveStatus status="loading" message={statusMessage} />
              )}

              {status === "error" && (
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,100,100,0.2)",
                    background: "rgba(255,100,100,0.04)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#ff6464",
                      marginBottom: "12px",
                      fontWeight: 500,
                      fontSize: "14px",
                    }}
                  >
                    {errorMessage}
                  </p>
                  <button
                    onClick={() => {
                      appState.reset();
                      recState.reset();
                    }}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,100,100,0.3)",
                      background: "transparent",
                      color: "#ff6464",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {status === "success" && playlistUrl && playlistId && (
                <>
                  {vibeCheck && <VibeCheck text={vibeCheck} />}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <SpotifyEmbed playlistUrl={playlistUrl} playlistId={playlistId} />
                    <div
                      style={{
                        padding: "14px",
                        background: "rgba(234, 179, 8, 0.08)",
                        border: "1px solid rgba(234, 179, 8, 0.2)",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          lineHeight: "1.5",
                          color: "#fbbf24",
                          fontWeight: 500,
                          textAlign: "center",
                        }}
                      >
                        This playlist will be automatically deleted in 24 hours from Server's account.
                      </p>
                    </div>
                  </div>
                  <PlaylistActions playlistUrl={playlistUrl} tracks={tracks} />
                  <MoodScoreCard tracks={tracks} />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ width: "100%", pointerEvents: "auto" }}>
          <ChatInput />
        </div>
      </div>
    </div>
  );
}