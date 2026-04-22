import type { Request, Response, NextFunction } from "express";
import {
  getSpotifyAuthUrl,
  exchangeCodeForTokens,
  isMasterAccountSetup,
} from "../services/spotifyAuth.service.js";
import { env } from "../config/env.js";

// ─── GET /api/auth/login ──────────────────────────────────────────────────────

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const alreadySetup = await isMasterAccountSetup();

    if (alreadySetup && env.NODE_ENV === "production") {
      res.status(200).json({
        message: "Master account already authenticated.",
      });
      return;
    }

    const authUrl = getSpotifyAuthUrl();
    console.log("🚨 EXACT REDIRECT URL:", authUrl);
    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/auth/callback ───────────────────────────────────────────────────

export async function callbackHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { code, error } = req.query;

    if (error) {
      res.status(400).send(`
        <html><body style="font-family:sans-serif;padding:40px">
          <h2>❌ Spotify Authorization Denied</h2>
          <p>Error: ${error}</p>
          <p><a href="/api/auth/login">Try again</a></p>
        </body></html>
      `);
      return;
    }

    if (!code || typeof code !== "string") {
      res.status(400).send("Missing authorization code from Spotify.");
      return;
    }

    await exchangeCodeForTokens(code);

    res.status(200).send(`
      <html><body style="font-family:sans-serif;padding:40px;max-width:600px;margin:auto">
        <h2>✅ Symphony Master Account Authenticated!</h2>
        <p>Tokens saved to database. You can close this tab.</p>
        <p>The app will automatically refresh tokens as needed.</p>
      </body></html>
    `);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/auth/status ─────────────────────────────────────────────────────

export async function statusHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const setup = await isMasterAccountSetup();
    res.json({
      masterAccountConfigured: setup,
      message: setup
        ? "✅ Master Spotify account is ready."
        : "⚠️ Visit /api/auth/login to authenticate.",
    });
  } catch (err) {
    next(err);
  }
}