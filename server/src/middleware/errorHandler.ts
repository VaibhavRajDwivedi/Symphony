import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err.message === "request entity too large") {
    console.error(`[ERROR] Payload too large. The frontend sent an image that exceeded express.json limit.`);
  } else {
    console.error(`[ERROR] ${err.message}`);
  }
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}