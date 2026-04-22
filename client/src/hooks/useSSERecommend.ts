import { useRecommendStore } from "../store/useRecommendStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { env } from "../config/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export function useSSERecommend() {
  const { setStatus, setError, setResult, reset } = useRecommendStore();
  const { user } = useAuthStore();
  const { fetchChats } = useChatStore();

  const recommend = async (prompt: string, sourceUrl?: string) => {
    reset();
    setStatus("loading");

    try {
      const response = await fetch(`${API_URL}/api/stream/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prompt,
          userId: user?.id ?? null,
          sourceUrl,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to server.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: ")) continue;
          if (!line.startsWith("data: ")) continue;

          const raw = line.slice(6).trim();
          if (!raw) continue;

          try {
            const parsed = JSON.parse(raw);

            if (parsed.message) {
              setStatus("loading", parsed.message);
            }

            if (parsed.playlistUrl) {
              setResult({
                playlistUrl: parsed.playlistUrl,
                playlistId: parsed.playlistId ?? "",
                playlistName: parsed.playlistName ?? "Your Playlist",
                tracks: parsed.tracks ?? [],
                notFound: parsed.notFound ?? [],
                vibeCheck: parsed.vibeCheck ?? null,
              });

              if (user) fetchChats();
            }

            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // Ignores parse errors on partial chunks
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    }
  };

  return { recommend };
}