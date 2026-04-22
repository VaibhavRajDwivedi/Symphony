import cron from "node-cron";
import axios from "axios";
import { prisma } from "../lib/prisma.js";
import { getAccessToken } from "./spotifyAuth.service.js";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

async function deleteExpiredPlaylists(): Promise<void> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const expired = await prisma.generatedPlaylist.findMany({
    where: {
      createdAt: { lte: twentyFourHoursAgo },
      deletedAt: null,
    },
  });

  if (expired.length === 0) {
    console.log("[Cleanup] No expired playlists found.");
    return;
  }

  console.log(`[Cleanup] Found ${expired.length} expired playlist(s) to delete.`);

  const accessToken = await getAccessToken();

  for (const record of expired) {
    try {
      // Unfollow = delete from master account
      await axios.delete(
        `${SPOTIFY_API_URL}/playlists/${record.playlistId}/followers`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      await prisma.generatedPlaylist.update({
        where: { id: record.id },
        data: { deletedAt: new Date() },
      });

      console.log(`[Cleanup] ✅ Deleted playlist: ${record.playlistId}`);
    } catch (err: any) {
      console.error(
        `[Cleanup] Failed to delete playlist ${record.playlistId}:`,
        err.response?.data || err.message
      );
    }
  }
}

export function startCleanupCron(): void {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    console.log("[Cleanup] Running scheduled playlist cleanup...");
    await deleteExpiredPlaylists();
  });

  console.log("[Cleanup] 🕐 Playlist cleanup cron started (runs every hour).");
}