import { z } from "zod";

export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(120),
  headline: z.string().trim().min(5).max(200),
  introduction: z.string().trim().min(10).max(1000),
  about: z.string().trim().min(10).max(2000),
  email: z.string().trim().email().max(254),
  location: z.string().trim().max(120),
  resumeUrl: z.string().trim().max(500),
  githubUrl: z.string().trim().max(500),
  linkedinUrl: z.string().trim().max(500),
}).superRefine((settings, ctx) => {
  const optionalUrls = [
    ["resumeUrl", settings.resumeUrl],
    ["githubUrl", settings.githubUrl],
    ["linkedinUrl", settings.linkedinUrl],
  ] as const;

  for (const [field, value] of optionalUrls) {
    if (!value) continue;

    const isLocalResume =
      field === "resumeUrl" &&
      value.startsWith("/") &&
      !value.startsWith("//");

    let isValidUrl = false;

    try {
      const parsed = new URL(value);
      isValidUrl = parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      isValidUrl = false;
    }

    if (!isLocalResume && !isValidUrl) {
      ctx.addIssue({
        code: "custom",
        path: [field],
        message: `${field} must be a valid HTTP/HTTPS URL or a local path for the resume.`,
      });
    }
  }
});

export type PortfolioSettings = z.infer<typeof settingsSchema>;