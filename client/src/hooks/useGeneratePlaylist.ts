import { useAppStore } from "../store/useAppStore";
import { useChatStore } from "../store/useChatStore";
import api from "../lib/axios";
import type { ApiResponse, GeneratePlaylistResult } from "../types";

export function useGeneratePlaylist() {
  const { setStatus, setError, setPreviewImage, setResult, reset } =
    useAppStore();

  const generate = async (file: File) => {
    reset();

    // Show image preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);

    try {
      // Step 1: Convert file to base64
      setStatus("uploading");
      const imageBase64 = await fileToBase64(file);

      // Step 2: Gemini extracting tracks
      setStatus("extracting");

      // Step 3: Spotify searching + building playlist
      // Transitions to "searching" status after a short delay for visibility
      setTimeout(() => setStatus("searching"), 2000);

      const mimeType = file.type as
        | "image/jpeg"
        | "image/png"
        | "image/webp";

      const { data } = await api.post<ApiResponse<GeneratePlaylistResult>>(
        "/api/generate-playlist",
        {
          imageBase64,
          mimeType,
        }
      );

      if (!data.success || !data.data) {
        throw new Error(data.error ?? "Failed to generate playlist.");
      }

      setResult(data.data);

      useChatStore.getState().createChat({
        mode: "image",
        title: "Screenshot Upload",
        playlistUrl: data.data.playlistUrl,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    }
  };

  return { generate };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:image/...;base64, prefix — API only wants raw base64
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Failed to convert image to base64."));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}