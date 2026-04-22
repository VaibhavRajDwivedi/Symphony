"use client";

import type { Track } from "../types";

export default function MoodScoreCard({ tracks }: { tracks: Track[] }) {
  if (!tracks || tracks.length === 0) return null;

  // Deterministic pseudo-random scores based on track data
  const generateScore = (seed: number, min: number, max: number) => {
    const hash = tracks.reduce((acc, t) => acc + t.title.length + t.artist.length, seed);
    return Math.floor((hash % (max - min + 1)) + min);
  };

  const scores = [
    { label: "Energy", value: generateScore(1, 40, 95), color: "#f97316" },
    { label: "Happiness", value: generateScore(2, 30, 90), color: "#facc15" },
    { label: "Danceability", value: generateScore(3, 50, 98), color: "#ec4899" },
    { label: "Acoustic", value: generateScore(4, 10, 80), color: "#2dd4bf" },
  ];

  return (
    <div style={{ 
      padding: "20px", 
      borderRadius: "14px", 
      background: "var(--bg-card)", 
      border: "1px solid var(--border)", 
      marginBottom: "20px" 
    }}>
      <h3 style={{ 
        fontSize: "11px", 
        fontWeight: 700, 
        color: "var(--text-secondary)", 
        textTransform: "uppercase", 
        letterSpacing: "0.05em", 
        marginBottom: "16px" 
      }}>
        Estimated Playlist DNA
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {scores.map((score) => (
          <div key={score.label} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ 
              width: "90px", 
              fontSize: "13px", 
              color: "var(--text-primary)" 
            }}>
              {score.label}
            </div>
            <div style={{ 
              flex: 1, 
              height: "6px", 
              background: "rgba(255,255,255,0.05)", 
              borderRadius: "10px", 
              overflow: "hidden" 
            }}>
              <div style={{ 
                height: "100%", 
                width: `${score.value}%`, 
                background: score.color, 
                borderRadius: "10px",
                transition: "width 1s ease-out"
              }} />
            </div>
            <div style={{ 
              width: "40px", 
              textAlign: "right", 
              fontSize: "12px", 
              color: "var(--text-secondary)", 
              fontFamily: "monospace" 
            }}>
              {score.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}