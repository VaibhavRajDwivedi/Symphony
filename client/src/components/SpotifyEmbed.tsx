"use client";

export default function SpotifyEmbed({ playlistUrl, playlistId }: { playlistUrl: string, playlistId: string }) {
  if (!playlistId) {
    return null;
  }


  return (
    <iframe 
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`} 
      width="100%" 
      height="352" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
      loading="lazy" 
      style={{ 
        border: 0, 
        borderRadius: "14px", 
        background: "#121212" 
      }}
    ></iframe>
  );
}