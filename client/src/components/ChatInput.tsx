"use client";

import { useState } from "react";
import { Plus, ArrowRight, Image as ImageIcon, MessageSquare, ChevronDown } from "lucide-react";
import { useSSEGenerate } from "../hooks/useSSEGenerate";
import { useSSERecommend } from "../hooks/useSSERecommend";
import { useAppStore } from "../store/useAppStore";
import { useRecommendStore } from "../store/useRecommendStore";
import { useDropzone } from "react-dropzone";
import { useAuthStore } from "../store/useAuthStore";
import { buildSpotifyAuthUrl } from "../lib/spotifyPKCE";

export default function ChatInput() {
  const [mode, setMode] = useState<"image" | "prompt" | "remix">("image");
  const [prompt, setPrompt] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModels, setShowModels] = useState(false);

  const { generate } = useSSEGenerate();
  const { recommend } = useSSERecommend();

  const appStore = useAppStore();
  const recStore = useRecommendStore();
  const { user } = useAuthStore();

  const isLoggedIn = !!user;
  const isSpotifyConnected = !!user?.spotifyAccessToken;

  const isProcessing =
    (appStore.status !== "idle" && appStore.status !== "success" && appStore.status !== "error") ||
    (recStore.status !== "idle" && recStore.status !== "success" && recStore.status !== "error");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleSpotifyConnect = async () => {
    const { url, codeVerifier } = await buildSpotifyAuthUrl();
    localStorage.setItem("spotify_verifier", codeVerifier);
    window.location.href = url;
  };

  const handleSubmit = async () => {
    if (isProcessing) return;
    if (mode === "image") {
      if (!selectedFile) return;
      const fileToGenerate = selectedFile;
      setSelectedFile(null);
      setPrompt("");
      await generate(fileToGenerate);
    } else if (mode === "remix") {
      if (!sourceUrl.trim()) {
        alert("Please provide a Spotify Playlist link.");
        return;
      }
      if (!prompt.trim()) return;
      const exceedsLimitRegex = /\b(1[0-9]{2}|[2-9][0-9]{2,})\b/;
      if (exceedsLimitRegex.test(prompt)) {
        alert("Limit exceeded: You can request a maximum of 100 tracks per remix.");
        return;
      }
      const textToRecommend = prompt;
      setPrompt("");
      const urlToPass = sourceUrl;
      setSourceUrl("");
      await recommend(textToRecommend, urlToPass);
    } else {
      if (!prompt.trim()) return;
      const textToRecommend = prompt;
      setPrompt("");
      await recommend(textToRecommend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey || e.shiftKey === false) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{ padding: "0 20px 24px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <div {...getRootProps()} style={{ borderRadius: "16px", border: "1px solid var(--border-hover)", background: "var(--bg-card)", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
        <input {...getInputProps()} />

        <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowModels(!showModels)} disabled={isProcessing} style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "12px", color: "var(--text-secondary)", fontSize: "12px", cursor: isProcessing ? "not-allowed" : "pointer", fontWeight: 500 }}>
              {mode === "image" ? <><ImageIcon size={14} /> Screenshot to Playlist</> : mode === "remix" ? <><MessageSquare size={14} /> Remix Playlist</> : <><MessageSquare size={14} /> Prompt to Playlist</>}
              <ChevronDown size={14} />
            </button>

            {showModels && !isProcessing && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "6px", display: "flex", flexDirection: "column", gap: "4px", minWidth: "180px", zIndex: 50, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                <button onClick={() => { setMode("image"); setShowModels(false); }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", background: mode === "image" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "image" ? "var(--text-primary)" : "var(--text-secondary)", border: "none", cursor: "pointer", textAlign: "left", fontSize: "13px" }}>
                  <ImageIcon size={14} /> Screenshot to Playlist
                </button>
                <button onClick={() => { setMode("prompt"); setShowModels(false); }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", background: mode === "prompt" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "prompt" ? "var(--text-primary)" : "var(--text-secondary)", border: "none", cursor: "pointer", textAlign: "left", fontSize: "13px" }}>
                  <MessageSquare size={14} /> Prompt to Playlist
                </button>
                <button onClick={() => { setMode("remix"); setShowModels(false); }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", borderRadius: "8px", background: mode === "remix" ? "rgba(255,255,255,0.1)" : "transparent", color: mode === "remix" ? "var(--text-primary)" : "var(--text-secondary)", border: "none", cursor: "pointer", textAlign: "left", fontSize: "13px" }}>
                  <MessageSquare size={14} /> Remix Playlist
                </button>
              </div>
            )}
          </div>
        </div>

        {mode === "image" && selectedFile && (
          <div style={{ padding: "12px 16px 0", display: "flex" }}>
            <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <img src={URL.createObjectURL(selectedFile)} alt="upload" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setSelectedFile(null)} style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer", fontSize: "10px" }}>×</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-end", padding: "12px 16px" }}>
          {mode === "image" && (
            <button onClick={open} disabled={isProcessing} style={{ width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", cursor: isProcessing ? "not-allowed" : "pointer", flexShrink: 0, marginBottom: "8px" }}>
              <Plus size={16} />
            </button>
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", marginLeft: mode === "image" ? "8px" : "0" }}>
            {mode === "remix" && !isLoggedIn ? (
              // Not signed in with Google at all — prompt login instead of Spotify OAuth
              <div style={{ padding: "12px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                Sign in to your account to connect Spotify and remix playlists.
              </div>
            ) : mode === "remix" && !isSpotifyConnected ? (
              <button
                onClick={handleSpotifyConnect}
                style={{
                  background: "var(--green)",
                  color: "#000",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                Connect Spotify to Remix Playlists
              </button>
            ) : (
              <>
                {mode === "remix" && isSpotifyConnected && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="text"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="Paste Spotify Playlist Link here..."
                      disabled={isProcessing}
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        padding: "8px 12px",
                        outline: "none",
                        flex: 1,
                      }}
                    />
                    <button
                      onClick={handleSpotifyConnect}
                      title="Reconnect Spotify (refreshes your token)"
                      style={{
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--green)",
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "6px 8px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      Reconnect
                    </button>
                  </div>
                )}
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === "image" ? "Upload a tracklist screenshot and hit Enter..." : mode === "remix" ? "Describe how you want to remix it (e.g., 'Only keep the high energy tracks')..." : "Describe your perfect playlist..."}
                  disabled={isProcessing}
                  rows={Math.max(1, Math.min(6, prompt.split("\n").length))}
                  style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.5, resize: "none", outline: "none", padding: mode === "remix" ? "4px 12px" : "6px 12px", minHeight: "44px" }}
                />
              </>
            )}
          </div>

          {!(mode === "remix" && (!isLoggedIn || !isSpotifyConnected)) && (
            <button
              onClick={handleSubmit}
              disabled={isProcessing || (mode === "image" ? !selectedFile : mode === "remix" ? !prompt.trim() || !sourceUrl.trim() : !prompt.trim())}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: isProcessing || (mode === "image" ? !selectedFile : mode === "remix" ? !prompt.trim() || !sourceUrl.trim() : !prompt.trim()) ? "rgba(255,255,255,0.1)" : "var(--green)",
                color: isProcessing || (mode === "image" ? !selectedFile : mode === "remix" ? !prompt.trim() || !sourceUrl.trim() : !prompt.trim()) ? "var(--text-muted)" : "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: isProcessing || (mode === "image" ? !selectedFile : mode === "remix" ? !prompt.trim() || !sourceUrl.trim() : !prompt.trim()) ? "not-allowed" : "pointer",
                flexShrink: 0,
                marginBottom: "6px",
                marginLeft: "8px",
              }}
            >
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}