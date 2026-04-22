import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";

const router = Router();

const JWT_SECRET = env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://127.0.0.1:${env.PORT}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails?.[0]?.value || "",
              name: profile.displayName || "",
              avatarUrl: profile.photos?.[0]?.value || "",
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

// Passport initialization
router.use(passport.initialize());

// Route 1: Trigger Auth
router.get("/", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

// Route 2: Callback
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: `${env.CLIENT_URL}/?error=auth_failed`, session: false }),
  (req, res) => {
    const user = req.user as any;
    if (!user) {
      res.redirect(`${env.CLIENT_URL}/?error=no_user`);
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    // Sets HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    });

    res.redirect(`${env.CLIENT_URL}`);
  }
);

// Route 3: Get current user
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// Route 4: Save user-level Spotify access token (obtained via PKCE on the frontend)
router.post("/spotify/save", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const { accessToken } = req.body as { accessToken?: string };

    if (!accessToken) {
      res.status(400).json({ message: "accessToken is required" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: { spotifyAccessToken: accessToken },
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(401).json({ message: "Invalid token or user not found" });
  }
});

export default router;
