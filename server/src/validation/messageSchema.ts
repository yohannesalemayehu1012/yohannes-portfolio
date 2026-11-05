
import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(5000),
  website: z.string().optional().default(""),
});

export type ContactMessageInput = z.infer<typeof messageSchema>;
