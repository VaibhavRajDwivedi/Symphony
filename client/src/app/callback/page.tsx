"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Posts message to parent and closes if opened as popup
    if (window.opener) {
      if (error) {
        window.opener.postMessage(
          { type: "SPOTIFY_CALLBACK", error },
          window.location.origin
        );
      } else if (code && state) {
        window.opener.postMessage(
          { type: "SPOTIFY_CALLBACK", code, state },
          window.location.origin
        );
      }
      window.close();
      return;
    }

    // Provides fallback handling if opened as redirect due to blocked popup
    // Routes back to main page with authorization code in query parameters
    if (code && state) {
      window.location.href = `/app?code=${code}&state=${state}`;
    } else if (error) {
      window.location.href = `/app?auth_error=${error}`;
    }
  }, [searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid #1a1a1a",
          borderTopColor: "#1db954",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ color: "#a0a0a0", fontSize: "14px" }}>
        Connecting to Spotify...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}