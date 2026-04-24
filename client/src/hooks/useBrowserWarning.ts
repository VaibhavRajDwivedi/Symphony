"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

export function useBrowserWarning() {
  useEffect(() => {
    const shown = sessionStorage.getItem("browser_warning_shown");
    if (shown) return;

    const ua = navigator.userAgent.toLowerCase();
    const isFirefox = ua.includes("firefox");
    const isBrave = (navigator as any).brave !== undefined;

    let message = "";

    if (isFirefox) {
      message =
        "🦊 Firefox detected — Spotify's embedded player may not work due to cookie restrictions. Open in Spotify directly or switch to Chrome/Edge for the full experience.";
    } 
    else if (isBrave) {
      message =
        "🛡️ Brave detected — if the Spotify player doesn't load, disable Brave Shields for this site.";
    } 
    else {
      message =
        "💡 If the Spotify player doesn't load, try disabling your adblocker for this site.";
    }

    const timer = setTimeout(() => {
      toast(message);
      sessionStorage.setItem("browser_warning_shown", "true");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
}