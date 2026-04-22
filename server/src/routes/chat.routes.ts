import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const router = Router();
const JWT_SECRET = env.JWT_SECRET;

// Inline middleware retrieving user from HttpOnly cookie
router.use((req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = payload.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
});

// GET / => Fetches all chats for authenticated user
router.get("/", async (req: any, res: any) => {
  try {
    const chats = await prisma.chatSession.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chat history" });
  }
});

// POST / => Creates a new ChatSession entry
router.post("/", async (req: any, res: any) => {
  try {
    const { title, mode, promptText, playlistUrl } = req.body;
    const chat = await prisma.chatSession.create({
      data: {
        userId: req.userId,
        title: title || "New Chat",
        mode: mode || "image",
        promptText: promptText || null,
        playlistUrl: playlistUrl || null,
      },
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating chat session" });
  }
});

// DELETE /:id => Deletes a specific chat session
router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Verifies chat ownership before deletion
    const chat = await prisma.chatSession.findFirst({
      where: { id, userId: req.userId },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found or unauthorized" });
      return;
    }

    await prisma.chatSession.delete({
      where: { id },
    });

    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete Chat Error:", err);
    res.status(500).json({ message: "Error deleting chat session" });
  }
});

export default router;

