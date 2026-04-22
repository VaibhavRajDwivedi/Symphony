import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { env } from "../config/env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export function useSSEGenerate() {
  const { setStatus, setError, setPreviewImage, setResult, reset } = useAppStore();
  const { user } = useAuthStore();
  const { fetchChats } = useChatStore();

  const generate = async (file: File) => {
    reset();

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setStatus("uploading");

    // Converts to base64 encoding
    const imageBase64 = await fileToBase64(file);
    const mimeType = file.type as "image/jpeg" | "image/png" | "image/webp";

    setStatus("extracting");

    try {
      const response = await fetch(`${API_URL}/api/stream/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          imageBase64,
          mimeType,
          userId: user?.id ?? null,
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
              // Handles status or progress event to update UI message
              setStatus("searching");
            }

            if (parsed.playlistUrl) {
              // Handles complete event
              setResult({
                playlistUrl: parsed.playlistUrl,
                playlistId: parsed.playlistId ?? "",
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

  return { generate };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      if (!base64) { reject(new Error("Failed to convert image.")); return; }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}