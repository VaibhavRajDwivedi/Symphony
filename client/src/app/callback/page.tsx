"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/*
 Symphony Auth Callback Handler
 Isolated to prevent Next.js Prerender errors during Vercel build.
*/
function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Standard Spotify Auth Parameters
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Flow A: Popup Logic
    // If the login was opened in a popup, we communicate back to the parent window
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

    // Flow B: Direct Redirect Fallback
    // If popups were blocked or it's a mobile redirect, send user back to /app
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
      <p style={{ color: "#a0a0a0", fontSize: "14px", fontWeight: 500 }}>
        Orchestrating Symphony...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/*
 Main Page Export
 The Suspense boundary is strictly required by Next.js for useSearchParams()
*/
export default function CallbackPage() {
  return (
    <Suspense 
      fallback={
        <div style={{ minHeight: "100vh", background: "#080808" }} />
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}