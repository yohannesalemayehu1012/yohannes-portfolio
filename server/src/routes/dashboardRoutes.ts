import { Router, type Request, type Response } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

interface CountRow {
  count: number;
}

interface RecentProjectRow {
  id: number;
  title: string;
  category: string;
  featured: number;
}

interface RecentMessageRow {
  id: number;
  name: string;
  email: string;
  subject: string;
  is_read: number;
  created_at: string;
}

// All dashboard statistics require administrator access.
router.get(
  "/stats",
  requireAdmin,
  (_req: Request, res: Response) => {
    const totalProjects = db
      .prepare("SELECT COUNT(*) AS count FROM projects")
      .get() as CountRow;

    const featuredProjects = db
      .prepare("SELECT COUNT(*) AS count FROM projects WHERE featured = 1")
      .get() as CountRow;

    const totalMessages = db
      .prepare("SELECT COUNT(*) AS count FROM messages")
      .get() as CountRow;

    const unreadMessages = db
      .prepare("SELECT COUNT(*) AS count FROM messages WHERE is_read = 0")
      .get() as CountRow;

    const recentProjects = db
      .prepare(`
        SELECT id, title, category, featured
        FROM projects
        ORDER BY id DESC
        LIMIT 5
      `)
      .all() as RecentProjectRow[];

    const recentMessages = db
      .prepare(`
        SELECT id, name, email, subject, is_read, created_at
        FROM messages
        ORDER BY created_at DESC, id DESC
        LIMIT 5
      `)
      .all() as RecentMessageRow[];

    res.json({
      success: true,
      data: {
        statistics: {
          totalProjects: totalProjects.count,
          featuredProjects: featuredProjects.count,
          totalMessages: totalMessages.count,
          unreadMessages: unreadMessages.count,
        },
        recentProjects: recentProjects.map((project) => ({
          ...project,
          featured: project.featured === 1,
        })),
        recentMessages: recentMessages.map((message) => ({
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject,
          isRead: message.is_read === 1,
          createdAt: message.created_at,
        })),
      },
    });
  },
);

export default router;