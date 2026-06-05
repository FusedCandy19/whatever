import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const createKeySchema = z.object({
  name: z.string().min(1).max(64),
  expiresAt: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  current: z.string().min(1),
  next: z.string().min(8),
  confirm: z.string(),
}).refine((d) => d.next === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export const brandingSchema = z.object({
  platformName: z.string().min(1).max(64),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  theme: z.string(),
});
