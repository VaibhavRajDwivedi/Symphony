"use client";

import { useState, useRef } from "react";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { useRecommendStore } from "../store/useRecommendStore";
import { useSSERecommend } from "../hooks/useSSERecommend";
import LiveStatus from "./LiveStatus";

const SUGGESTIONS = [
  "Late night Tokyo rain, jazz and lo-fi",
  "90s Bollywood heartbreak, slow tempo",
  "Hype gym playlist, 2010s hip-hop, fast BPM",
  "Sunday morning chill, indie folk, acoustic",
  "Dark academia classical mix, brooding",
];

export default function RecommendBox() {
  const { status, statusMessage, errorMessage, reset } = useRecommendStore();
  const { recommend } = useSSERecommend();

  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "loading";
  const isError = status === "error";
  const isSuccess = status === "success";

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return;
    recommend(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submits on Cmd/Ctrl+Enter or Enter without shift
    if (((e.metaKey || e.ctrlKey) && e.key === "Enter") || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  };

  // Hides input box upon successful playlist creation, as main page handles result display.
  if (isSuccess) return null;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "640px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "20px",
            border: "1px solid rgba(29,185,84,0.3)",
            background: "rgba(29,185,84,0.06)",
            marginBottom: "16px",
          }}
        >
          <Sparkles size={12} color="var(--green)" />
          <span
            style={{
              fontSize: "11px",
              color: "var(--green)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            AI Recommend
          </span>
        </div>

        <h2
          style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          Describe your perfect playlist
        </h2>
      </div>

      {/* Input Card */}
      <div
        style={{
          borderRadius: "16px",
          border: `1px solid ${isError ? "rgba(239,68,68,0.4)" : "var(--border-hover)"}`,
          background: "var(--bg-card)",
          overflow: "hidden",
        }}
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="e.g. Late night drive playlist, 2000s R&B, slow jams..."
          rows={4}
          style={{
            width: "100%",
            padding: "20px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "15px",
            lineHeight: 1.7,
            resize: "none",
            opacity: isLoading ? 0.5 : 1,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {prompt.length} / 1000
          </span>

          <button
            onClick={handleSubmit}
            disabled={isLoading || prompt.trim().length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: isLoading || prompt.trim().length === 0 ? "rgba(255,255,255,0.05)" : "var(--green)",
              color: isLoading || prompt.trim().length === 0 ? "var(--text-muted)" : "#000",
              fontWeight: 700,
              fontSize: "13px",
              cursor: isLoading || prompt.trim().length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Working..." : "Generate"}
            {!isLoading && <ArrowRight size={13} />}
          </button>
        </div>
      </div>

      {/* Live Progress Streaming Component */}
      {isLoading && (
        <LiveStatus status="loading" message={statusMessage} />
      )}

      {/* Error Message */}
      {isError && errorMessage && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "13px", color: "rgba(239,68,68,0.9)", flex: 1 }}>
            {errorMessage}
          </p>
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "transparent",
              border: "none",
              color: "rgba(239,68,68,0.8)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={11} />
            Try again
          </button>
        </div>
      )}

      {/* Suggestions */}
      {!isLoading && !isError && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.02)",
                color: "var(--text-secondary)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}