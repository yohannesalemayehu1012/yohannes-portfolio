import { Router, type Request, type Response } from "express";
import { db } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { settingsSchema } from "../settingsSchema.js";

const router = Router();

interface SettingsRow {
  id: number;
  name: string;
  role: string;
  headline: string;
  introduction: string;
  about: string;
  email: string;
  location: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  updated_at: string;
}

const selectSettings = db.prepare(`
  SELECT
    id,
    name,
    role,
    headline,
    introduction,
    about,
    email,
    location,
    resumeUrl,
    githubUrl,
    linkedinUrl,
    updated_at
  FROM portfolio_settings
  WHERE id = 1
`);

// Public: retrieve settings for the portfolio website.
router.get("/", (_req: Request, res: Response) => {
  const settings = selectSettings.get() as SettingsRow | undefined;

  if (!settings) {
    res.status(404).json({
      success: false,
      message: "Portfolio settings not found.",
    });
    return;
  }

  const { id, updated_at, ...publicSettings } = settings;

  res.json({
    success: true,
    data: {
      ...publicSettings,
      updatedAt: updated_at,
    },
  });
});

// Admin only: update portfolio settings.
router.put("/", requireAdmin, (req: Request, res: Response) => {
  const result = settingsSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Please check the settings you entered.",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const settings = result.data;

  db.prepare(`
    UPDATE portfolio_settings
    SET
      name = @name,
      role = @role,
      headline = @headline,
      introduction = @introduction,
      about = @about,
      email = @email,
      location = @location,
      resumeUrl = @resumeUrl,
      githubUrl = @githubUrl,
      linkedinUrl = @linkedinUrl,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(settings);

  const updated = selectSettings.get() as SettingsRow;

  const { id, updated_at, ...publicSettings } = updated;

  res.json({
    success: true,
    message: "Portfolio settings updated successfully.",
    data: {
      ...publicSettings,
      updatedAt: updated_at,
    },
  });
});

export default router;