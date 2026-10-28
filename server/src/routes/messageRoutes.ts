
import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const messageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(5000),
  website: z.string().optional().default(""),
});

type StoredMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
};

const insertMessage = db.prepare(`
  INSERT INTO messages (name, email, subject, message)
  VALUES (?, ?, ?, ?)
`);

const listMessages = db.prepare(`
  SELECT id, name, email, subject, message, is_read, created_at
  FROM messages
  ORDER BY created_at DESC, id DESC
`);

const findMessage = db.prepare(`
  SELECT id FROM messages WHERE id = ?
`);

const markMessageRead = db.prepare(`
  UPDATE messages SET is_read = ? WHERE id = ?
`);

const removeMessage = db.prepare(`
  DELETE FROM messages WHERE id = ?
`);

// Basic in-memory rate limit: up to 5 submissions per IP per 15 minutes.
// This resets if the server restarts and is intended for a small project.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

function allowSubmission(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_SUBMISSIONS) {
    submissions.set(ip, recent);
    return false;
  }

  recent.push(now);
  submissions.set(ip, recent);
  return true;
}

// PUBLIC: submit a contact message
router.post("/", (req: Request, res: Response) => {
  const parsed = messageSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Please check your name, email, subject, and message.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  // Hidden honeypot field: ordinary visitors should leave this empty.
  if (parsed.data.website.trim() !== "") {
    // Return a generic success response to avoid revealing the honeypot.
    res.status(201).json({
      success: true,
      message: "Your message has been received.",
    });
    return;
  }

  const ip = req.ip || "unknown";

  if (!allowSubmission(ip)) {
    res.status(429).json({
      success: false,
      message: "Too many messages. Please try again in 15 minutes.",
    });
    return;
  }

  try {
    insertMessage.run(
      parsed.data.name,
      parsed.data.email,
      parsed.data.subject,
      parsed.data.message,
    );

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "We could not send your message. Please try again later.",
    });
  }
});

// ADMIN ONLY: list messages
router.get("/", requireAdmin, (_req: Request, res: Response) => {
  const messages = listMessages.all() as StoredMessage[];

  res.json({
    success: true,
    count: messages.length,
    data: messages.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      isRead: item.is_read === 1,
      createdAt: item.created_at,
    })),
  });
});

// ADMIN ONLY: mark a message read or unread
router.patch("/:id/read", requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const isRead = req.body?.isRead;

  if (!Number.isSafeInteger(id) || id < 1 || typeof isRead !== "boolean") {
    res.status(400).json({
      success: false,
      message: "A valid message ID and isRead boolean are required.",
    });
    return;
  }

  if (!findMessage.get(id)) {
    res.status(404).json({
      success: false,
      message: "Message not found.",
    });
    return;
  }

  markMessageRead.run(isRead ? 1 : 0, id);

  res.json({
    success: true,
    message: isRead ? "Message marked as read." : "Message marked as unread.",
  });
});

// ADMIN ONLY: delete a message
router.delete("/:id", requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({
      success: false,
      message: "Invalid message ID.",
    });
    return;
  }

  const result = removeMessage.run(id);

  if (result.changes === 0) {
    res.status(404).json({
      success: false,
      message: "Message not found.",
    });
    return;
  }

  res.json({ success: true, message: "Message deleted." });
});

export default router;
