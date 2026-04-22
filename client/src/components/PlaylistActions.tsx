"use client";

import { useUserSpotify } from "../hooks/useUserSpotify";
import { Track } from "../types";
import { Check, Plus, Loader2 } from "lucide-react";

interface PlaylistActionsProps {
  playlistUrl: string;
  tracks: Track[];
}

export default function PlaylistActions({ playlistUrl, tracks }: PlaylistActionsProps) {
  const { saveStatus, errorMessage, initiateAuth } = useUserSpotify();

  const handleSave = () => {
    initiateAuth(tracks);
  };

  const isSaving = saveStatus === "authenticating" || saveStatus === "saving";
  const isSuccess = saveStatus === "success";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <button
        onClick={handleSave}
        disabled={isSaving || isSuccess}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          background: isSuccess ? "transparent" : "var(--green)",
          color: isSuccess ? "var(--green)" : "#000",
          border: isSuccess ? "1px solid var(--green)" : "none",
          padding: "16px",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: (isSaving || isSuccess) ? "default" : "pointer",
          transition: "all 0.2s",
          width: "100%",
          opacity: isSaving ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!isSaving && !isSuccess) {
            e.currentTarget.style.opacity = "0.9";
          }
        }}
        onMouseOut={(e) => {
          if (!isSaving && !isSuccess) {
            e.currentTarget.style.opacity = "1";
          }
        }}
      >
        {isSaving && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
        {!isSaving && isSuccess && <Check size={18} />}
        {!isSaving && !isSuccess && <Plus size={18} />}

        {isSaving ? "Saving to Spotify..." : isSuccess ? "Saved to Your Library!" : "Create Playlist in My Account Instead"}
      </button>

      {saveStatus === "error" && errorMessage && (
        <div style={{ color: "#ff6464", fontSize: "13px", marginTop: "4px", textAlign: "center" }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}
