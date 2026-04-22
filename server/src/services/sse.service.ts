import type { Response } from "express";

export class SSEStream {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
  }

  send(event: string, data: unknown): void {
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    this.res.write(`event: ${event}\ndata: ${payload}\n\n`);
  }

  status(message: string): void {
    this.send("status", { message });
  }

  progress(message: string, current: number, total: number): void {
    this.send("progress", { message, current, total });
  }

  complete(data: unknown): void {
    this.send("complete", data);
    this.res.end();
  }

  error(message: string): void {
    this.send("error", { message });
    this.res.end();
  }
}