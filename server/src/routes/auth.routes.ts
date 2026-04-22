import { Router } from "express";
import {
  loginHandler,
  callbackHandler,
  statusHandler,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", loginHandler);
router.get("/callback", callbackHandler);
router.get("/status", statusHandler);

router.get("/whoami", async (req, res) => {
  const { getAccessToken } = await import("../services/spotifyAuth.service.js");
  const axios = (await import("axios")).default;
  const token = await getAccessToken();
  const { data } = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  res.json({ id: data.id, display_name: data.display_name });
});

router.get("/test-playlist", async (req, res) => {
  const { getAccessToken } = await import("../services/spotifyAuth.service.js");
  const axios = (await import("axios")).default;
  const token = await getAccessToken();
  const { data } = await axios.post(
    `https://api.spotify.com/v1/users/315sgoobn7s5vdjr36rbebakwzl4/playlists`,
    { name: "Test", public: true },
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  res.json(data);
});


router.get("/scopes", async (req, res) => {
  const { getAccessToken } = await import("../services/spotifyAuth.service.js");
  const axios = (await import("axios")).default;
  const token = await getAccessToken();
  const { data } = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  res.json(data);
});

export default router;