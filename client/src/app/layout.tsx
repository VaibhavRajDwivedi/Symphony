import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Symphony — AI Playlist Generator",
  description:
    "Upload a screenshot of any music queue or tracklist. Symphony uses AI to instantly build a shareable Spotify playlist.",
  keywords: ["spotify", "playlist", "AI", "music", "generator"],
  openGraph: {
    title: "Symphony — AI Playlist Generator",
    description: "Turn any tracklist screenshot into a Spotify playlist instantly.",
    type: "website",
  },
};

import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ margin: 0, padding: 0, position: "relative", zIndex: 1, backgroundColor: "var(--bg-primary)" }}>
        {children}
      </body>
    </html>
  );
}